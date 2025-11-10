from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from .models import Lesson, Quiz, Question, Badge, Progress
from .serializers import (
    LessonSerializer,
    QuizSerializer,
    QuestionSerializer,
    BadgeSerializer,
    ProgressSerializer,
)

# =========================================================
# USER REGISTRATION (SIGNUP)
# =========================================================

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """
    Register a new user with username, email, and password.
    """
    username = request.data.get("username")
    email = request.data.get("email", "")
    password = request.data.get("password")

    # Validation
    if not username or not password:
        return Response(
            {"error": "Username and password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Create user
    user = User.objects.create_user(username=username, email=email, password=password)
    user.save()

    return Response(
        {"message": "✅ User registered successfully! You can now log in."},
        status=status.HTTP_201_CREATED,
    )


# =========================================================
# LESSONS
# =========================================================

class LessonList(generics.ListAPIView):
    """
    List all lessons (open to all users)
    """
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.AllowAny]


class LessonDetail(generics.RetrieveAPIView):
    """
    Retrieve a single lesson by ID
    """
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'


# =========================================================
# QUIZZES
# =========================================================

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_questions(request, quiz_id):
    """
    Retrieve all questions for a specific quiz.
    """
    try:
        quiz = Quiz.objects.get(id=quiz_id)
    except Quiz.DoesNotExist:
        return Response({"error": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)

    questions = Question.objects.filter(quiz=quiz)
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submit_quiz(request, quiz_id):
    """
    Evaluate quiz answers, calculate score and XP, and update progress.
    Rules:
      - percent >= 70 → earn full lesson points
      - else → earn half points (rounded)
    """
    try:
        quiz = Quiz.objects.get(id=quiz_id)
    except Quiz.DoesNotExist:
        return Response({"error": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)

    answers = request.data.get("answers", [])
    score = 0
    total = 0

    # ✅ Calculate quiz score
    for ans in answers:
        try:
            q = Question.objects.get(id=ans["question_id"], quiz=quiz)
            total += 1
            if ans["answer"].strip().upper() == q.correct_answer.upper():
                score += 1
        except Question.DoesNotExist:
            continue

    percent = int((score / total) * 100) if total else 0
    lesson = quiz.lesson
    points_earned = lesson.points if percent >= 70 else round(lesson.points / 2)

    # ✅ Update or create progress record
    progress, _ = Progress.objects.get_or_create(user=request.user, lesson=lesson)
    progress.score = score
    progress.xp += points_earned
    progress.progress_pct = max(progress.progress_pct, percent)
    progress.completed = percent >= 70
    progress.save()

    # =========================================================
    # 🏅 BADGE SYSTEM
    # =========================================================

    completed_lessons = Progress.objects.filter(user=request.user, completed=True).count()

    # 1️⃣ Badge: 100 XP Achiever
    if progress.xp >= 100 and not Badge.objects.filter(code="first100").exists():
        badge = Badge.objects.create(
            name="💪 100 XP Achiever",
            code="first100",
            description="Earned 100 XP through learning!"
        )
        progress.earned_badge = badge
        progress.save()

    # 2️⃣ Badge: 3 Lessons Completed
    if completed_lessons >= 3 and not Badge.objects.filter(code="triplelearn").exists():
        badge = Badge.objects.create(
            name="📘 Triple Learner",
            code="triplelearn",
            description="Completed 3 lessons successfully!"
        )
        progress.earned_badge = badge
        progress.save()

    # =========================================================
    # ✅ RETURN RESPONSE
    # =========================================================
    return Response(
        {
            "score": score,
            "total": total,
            "percent": percent,
            "points_earned": points_earned,
            "new_xp_total": progress.xp,
            "completed": progress.completed,
            "message": f"You got {score}/{total}. Earned {points_earned} points!",
        },
        status=status.HTTP_200_OK,
    )


# =========================================================
# BADGES
# =========================================================

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_badges(request):
    """
    Return all available badges.
    """
    badges = Badge.objects.all()
    serializer = BadgeSerializer(badges, many=True)
    return Response(serializer.data)


# =========================================================
# PROGRESS
# =========================================================

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_progress(request):
    """
    Return current user's progress and XP summary.
    """
    progress = Progress.objects.filter(user=request.user)
    serializer = ProgressSerializer(progress, many=True)
    return Response(serializer.data)

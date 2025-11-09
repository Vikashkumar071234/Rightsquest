# main/views.py

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
# LESSONS
# =========================================================

class LessonList(generics.ListAPIView):
    """
    List all lessons (open to all)
    """
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.AllowAny]


class LessonDetail(generics.RetrieveAPIView):
    """
    Retrieve single lesson by ID (open to all)
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
    Get all questions for a specific quiz.
    """
    try:
        quiz = Quiz.objects.get(id=quiz_id)
    except Quiz.DoesNotExist:
        return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

    questions = Question.objects.filter(quiz=quiz)
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submit_quiz(request, quiz_id):
    """
    Check user answers, calculate score, update Progress with 🎯 points and progress%.
    Rule:
      - percent >= 70 -> earn full lesson.points
      - else earn half (rounded)
    """
    try:
        quiz = Quiz.objects.get(id=quiz_id)
    except Quiz.DoesNotExist:
        return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

    answers = request.data.get('answers', [])  # [{"question_id":1, "answer":"A"}, ...]
    score = 0
    total = 0

    for ans in answers:
        try:
            q = Question.objects.get(id=ans["question_id"], quiz=quiz)
            total += 1
            if ans["answer"].upper() == q.correct_answer.upper():
                score += 1
        except Question.DoesNotExist:
            continue

    percent = int((score / total) * 100) if total else 0
    lesson = quiz.lesson
    points_earned = lesson.points if percent >= 70 else round(lesson.points / 2)

    # Get or create progress and update
    progress, _created = Progress.objects.get_or_create(user=request.user, lesson=lesson)
    progress.score = score
    progress.xp += points_earned
    progress.progress_pct = max(progress.progress_pct, percent)
    progress.completed = percent >= 70
    progress.save()

    return Response({
        "score": score,
        "total": total,
        "percent": percent,
        "points_earned": points_earned,
        "new_xp_total": progress.xp,
        "completed": progress.completed,
        "message": f"You got {score}/{total}. Earned {points_earned} points."
    }, status=status.HTTP_200_OK)


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
    Return current user's learning progress.
    """
    progress = Progress.objects.filter(user=request.user)
    serializer = ProgressSerializer(progress, many=True)
    return Response(serializer.data)

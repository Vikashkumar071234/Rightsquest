# rightsquest_backend/main/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .models import Lesson, Quiz, Question, Badge, Progress
from .serializers import (
    LessonSerializer, QuizSerializer, QuestionSerializer,
    BadgeSerializer, ProgressSerializer
)

# ---------- AUTHENTICATION ----------

@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
    User.objects.create_user(username=username, password=password)
    return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        login(request, user)
        return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
    return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_user(request):
    logout(request)
    return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)


# ---------- LESSONS ----------

class LessonList(generics.ListAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.AllowAny]


class LessonDetail(generics.RetrieveAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'


# ---------- QUIZZES ----------

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_questions(request, quiz_id):
    """
    Get all questions for a quiz
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
    Check user answers, calculate score, and store progress
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
            question = Question.objects.get(id=ans["question_id"], quiz=quiz)
            total += 1
            if ans["answer"].upper() == question.correct_answer.upper():
                score += 1
        except Question.DoesNotExist:
            continue

    # Store user progress
    progress, created = Progress.objects.get_or_create(
        user=request.user,
        lesson=quiz.lesson,
        defaults={"score": score, "completed": True}
    )
    if not created:
        progress.score = score
        progress.completed = True
        progress.save()

    return Response({
        "score": score,
        "total": total,
        "message": f"You got {score} out of {total} correct!"
    }, status=status.HTTP_200_OK)


# ---------- BADGES ----------

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_badges(request):
    badges = Badge.objects.all()
    serializer = BadgeSerializer(badges, many=True)
    return Response(serializer.data)


# ---------- PROGRESS ----------

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_progress(request):
    progress = Progress.objects.filter(user=request.user)
    serializer = ProgressSerializer(progress, many=True)
    return Response(serializer.data)

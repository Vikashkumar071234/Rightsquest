from rest_framework import serializers
from .models import Lesson, Quiz, Question, Badge, Progress


# -------------------------------
# Question Serializer
# -------------------------------
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


# -------------------------------
# Quiz Serializer
# -------------------------------
class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'lesson', 'title', 'questions']


# -------------------------------
# Lesson Serializer
# -------------------------------
class LessonSerializer(serializers.ModelSerializer):
    quizzes = QuizSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'content', 'points', 'created_at', 'quizzes']


# -------------------------------
# Badge Serializer
# -------------------------------
class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = '__all__'


# -------------------------------
# Progress Serializer
# -------------------------------
class ProgressSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    lesson = serializers.StringRelatedField(read_only=True)
    earned_badge = BadgeSerializer(read_only=True)

    class Meta:
        model = Progress
        fields = ['id', 'user', 'lesson', 'completed', 'score', 'earned_badge']

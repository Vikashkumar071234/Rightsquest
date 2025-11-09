# main/serializers.py
from rest_framework import serializers
from .models import Lesson, Quiz, Question, Badge, Progress

class QuestionSerializer(serializers.ModelSerializer):
    class Meta: model = Question; fields = '__all__'

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta: model = Quiz; fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    quizzes = QuizSerializer(many=True, read_only=True)
    class Meta: model = Lesson; fields = '__all__'

class BadgeSerializer(serializers.ModelSerializer):
    class Meta: model = Badge; fields = '__all__'

class ProgressSerializer(serializers.ModelSerializer):
    lesson_id = serializers.IntegerField(source='lesson.id', read_only=True)
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    class Meta:
        model = Progress
        fields = ['id','lesson_id','lesson_title','completed','score','xp','progress_pct','earned_badge']

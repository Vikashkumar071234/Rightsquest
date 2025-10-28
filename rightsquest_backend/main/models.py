from django.db import models

class Lesson(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    content = models.TextField(blank=True)
    points = models.IntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.title

class Quiz(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='quizzes')
    title = models.CharField(max_length=200)
    def __str__(self):
        return self.title

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.CharField(max_length=255)
    choices = models.JSONField(default=list)
    answer_index = models.IntegerField(default=0)
    def __str__(self):
        return self.text

class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    code = models.CharField(max_length=50, unique=True)
    def __str__(self):
        return self.name

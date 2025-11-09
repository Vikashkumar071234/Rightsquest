from django.db import models
from django.contrib.auth.models import User


# --------------------------------------------------
# LESSON MODEL
# --------------------------------------------------
class Lesson(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    content = models.TextField()
    points = models.IntegerField(default=10)  # Maximum points for completing this lesson
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# --------------------------------------------------
# QUIZ MODEL
# --------------------------------------------------
class Quiz(models.Model):
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='quizzes'
    )
    title = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.lesson.title} - {self.title}"


# --------------------------------------------------
# QUESTION MODEL
# --------------------------------------------------
class Question(models.Model):
    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name='questions'
    )
    question_text = models.TextField()
    option_a = models.CharField(max_length=200)
    option_b = models.CharField(max_length=200)
    option_c = models.CharField(max_length=200)
    option_d = models.CharField(max_length=200)
    correct_answer = models.CharField(
        max_length=1,
        choices=[
            ('A', 'Option A'),
            ('B', 'Option B'),
            ('C', 'Option C'),
            ('D', 'Option D'),
        ]
    )

    def __str__(self):
        return f"{self.quiz.title} - {self.question_text}"


# --------------------------------------------------
# BADGE MODEL
# --------------------------------------------------
class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=100, blank=True)
    code = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


# --------------------------------------------------
# PROGRESS MODEL
# --------------------------------------------------
class Progress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    score = models.IntegerField(default=0)  # raw correct count
    xp = models.IntegerField(default=0)  # 🎯 total points earned
    progress_pct = models.PositiveIntegerField(default=0)  # 0..100
    earned_badge = models.ForeignKey(
        Badge,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    class Meta:
        unique_together = ('user', 'lesson')
        verbose_name_plural = "Progress Records"

    def __str__(self):
        status = "Completed" if self.completed else "In Progress"
        return f"{self.user.username} - {self.lesson.title} ({status})"

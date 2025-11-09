# rightsquest_backend/main/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # ---------- LESSONS ----------
    path('lessons/', views.LessonList.as_view(), name='lesson-list'),
    path('lessons/<int:id>/', views.LessonDetail.as_view(), name='lesson-detail'),

    # ---------- QUIZZES ----------
    path('quizzes/<int:quiz_id>/questions/', views.get_questions, name='quiz-questions'),
    path('quizzes/<int:quiz_id>/submit/', views.submit_quiz, name='quiz-submit'),

    # ---------- BADGES ----------
    path('badges/', views.get_badges, name='badge-list'),

    # ---------- PROGRESS ----------
    path('progress/', views.get_progress, name='progress'),
]

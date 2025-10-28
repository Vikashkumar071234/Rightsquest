from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, QuizViewSet, QuestionViewSet, BadgeViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'lessons', LessonViewSet)
router.register(r'quizzes', QuizViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'badges', BadgeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

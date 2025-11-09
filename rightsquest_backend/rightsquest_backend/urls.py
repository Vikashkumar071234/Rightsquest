from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "Welcome to RightsQuest Backend API!"})

urlpatterns = [
    # ---------- ADMIN PANEL ----------
    path('admin/', admin.site.urls),

    # ---------- ROOT (Home Endpoint) ----------
    path('', home),

    # ---------- MAIN APP ROUTES ----------
    path('api/', include('main.urls')),  # Includes all your app routes (lessons, quizzes, register, etc.)

    # ---------- JWT AUTH TOKEN ROUTES ----------
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # For login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # For refreshing token
]

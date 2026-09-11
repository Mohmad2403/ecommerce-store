from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(TokenObtainPairView):
    pass

class MeView(APIView):
    permission_classes=[permissions.IsAuthenticated]

    def get(self,request):
        user=request.user
        return Response({
            'id':user.id,
            'username':user.username,
            'email':user.email,
            'phone':user.phone,
            'address':user.address,
            'is_admin_user':user.is_admin_user,
            'date_joined':user.date_joined,
        })

    def patch(self,request):
        user=request.user
        user.email=request.data.get('email',user.email)
        user.phone=request.data.get('phone',user.phone)
        user.address=request.data.get('address',user.address)
        user.save()
        return Response({
            'id':user.id,
            'username':user.username,
            'email':user.email,
            'phone':user.phone,
            'address':user.address,
            'is_admin_user':user.is_admin_user,
            'date_joined':user.date_joined,
        })
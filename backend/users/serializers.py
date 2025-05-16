from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from rest_framework import serializers
from .models import User
from django.conf import settings

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'password', 'profile_picture', 'bio')

class UserSerializer(BaseUserSerializer):
    profile_picture = serializers.SerializerMethodField()
    
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'profile_picture', 'bio')
    
    def get_profile_picture(self, obj):
        if obj.profile_picture and obj.profile_picture.url:
            # Return absolute URL by combining domain with relative URL
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return f"http://127.0.0.1:8000{obj.profile_picture.url}"
        return None

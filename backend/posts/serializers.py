from rest_framework import serializers
from .models import Post
from users.serializers import UserSerializer

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    author_username = serializers.ReadOnlyField(source='author.username')
    image_url = serializers.SerializerMethodField()
    audio_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'author', 'author_username', 'topic', 'content', 
                  'image', 'image_url', 'audio', 'audio_url', 
                  'created_at', 'updated_at']
        read_only_fields = ['author', 'created_at', 'updated_at']
    
    def get_image_url(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return f"http://127.0.0.1:8000{obj.image.url}"
        return None
        
    def get_audio_url(self, obj):
        if obj.audio and hasattr(obj.audio, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.audio.url)
            return f"http://127.0.0.1:8000{obj.audio.url}"
        return None
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data) 
from webapp.models import Quote
from rest_framework import serializers


class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = ('id', 'text', 'created_at', 'status', 'author_name', 'author_email', 'rating')

from django.urls import path
from . import views

urlpatterns = [
    path('notes/', views.NoteListCreateView.as_view(), name='note-list-create'),
    path('notes/delete/<int:pk>/', views.NoteDeleteView.as_view(), name='note-delete'),
    path('notes/update/<int:pk>/', views.NoteUpdateView.as_view(), name='note-update'),
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/delete/<int:pk>/', views.CategoryDeleteView.as_view(), name='category-delete'),
]

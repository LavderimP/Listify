from django.db import models

# * List Model: A model representing a user's list with different attributes
class List(models.Model):
    # * Meta: Fields to track when the list is created and updated
    created_at = models.DateTimeField(auto_now_add=True)  # Auto-populated timestamp when the list is created
    updated_at = models.DateTimeField(auto_now=True)  # Auto-populated timestamp when the list is updated
    list_id = models.BigAutoField(primary_key=True)  # Unique ID for each list

    # * Relationships: A foreign key relationship to the User model
    user = models.ForeignKey("user.User", on_delete=models.CASCADE)  # Links each list to a specific user

    # * Fields: The data fields of the list
    title = models.TextField(max_length=30)  # The title of the list, with a maximum length of 30 characters
    CATEGORY_CHOICES = [
        ("personal", "Personal"),  # Category for personal lists
        ("work", "Work"),          # Category for work-related lists
        ("home", "Home"),          # Category for home-related lists
        ("books", "Books"),        # Category for books-related lists
        ("article", "Article"),    # Category for articles-related lists
        ("list", "List"),          # Category for general lists
    ]
    # A field to select the category from predefined choices (null and blank values are allowed)
    category = models.CharField(
        max_length=10, choices=CATEGORY_CHOICES, null=True, blank=True
    )
    pined = models.BooleanField(default=False, null=True, blank=True)  # Boolean field to mark if the list is pinned
    reminder = models.DateTimeField(null=True, blank=True)  # A datetime field for reminders (optional)
    text = models.TextField(max_length=800, null=True, blank=True)  # Text field for additional information about the list

    def __str__(self):
        return str(self.list_id)  # Return the list ID as the string representation of the list

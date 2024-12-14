from django.shortcuts import render
from django.conf import settings
import json
import os
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.forms.models import model_to_dict
from .models import Recipe, Tag, Event, List
from django.views.decorators.csrf import csrf_protect

# Load manifest when server launches
MANIFEST = {}
if not settings.DEBUG:
    f = open(f"{settings.BASE_DIR}/core/static/manifest.json")
    MANIFEST = json.load(f)

@login_required
def index(req):
    context = {
        "asset_url": os.environ.get("ASSET_URL", ""),
        "debug": settings.DEBUG,
        "manifest": MANIFEST,
        "js_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["file"],
        "css_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["css"][0]
    }
    return render(req, "core/index.html", context)

@login_required
def me(req):
    return JsonResponse({"user": model_to_dict(req.user)})

@login_required
def recipes(req):
    if req.method == "POST":
        body = json.loads(req.body)
        recipe = Recipe(
            title=body["title"],
            ingredients=body["ingredients"],
            instructions=body["instructions"],
            tags=body["tags"],
            user=req.user,
            public=body["public"]
        )
        recipe.save()
        return JsonResponse({"recipe": model_to_dict(recipe)})

    user_recipes = [model_to_dict(recipe) for recipe in req.user.recipe_set.all()]
    public_recipes = [model_to_dict(recipe) for recipe in Recipe.objects.filter(public=True).exclude(user=req.user)]
    return JsonResponse({"recipes": user_recipes + public_recipes})

@login_required
def delete_recipe(req, recipe_id):
    if req.method == 'DELETE':
        recipe = Recipe.objects.get(id=recipe_id)
        recipe.delete()
        return JsonResponse({"message": "Recipe deleted"})

@login_required
def add_event(req):
    if req.method == "POST":
        body = json.loads(req.body)
        recipe_id = body["recipe_id"]
        date = body["date"]
        recipe = Recipe.objects.get(id=recipe_id)
        event = Event(user=req.user, recipe=recipe, date=date)
        event.save()
        return JsonResponse({"message": "Event added"})

def get_tags(req):
    tags = list(Tag.objects.values('name'))
    return JsonResponse(tags, safe=False)

@login_required
def get_events(req):
    events = Event.objects.filter(user=req.user).select_related('recipe')
    events_data = [
        {
            'id': event.id,
            'date': event.date,
            'recipe': {
                'id': event.recipe.id,
                'title': event.recipe.title,
            }
        }
        for event in events
    ]
    return JsonResponse({'events': events_data})

@login_required
def delete_event(req, event_id):
    if req.method == 'DELETE':
        event = Event.objects.get(id=event_id)
        event.delete()
        return JsonResponse({"message": "Event deleted"})
    
@login_required
def shopping_list(req):
    if req.method == "GET":
        try:
            # Try to get the shopping list for the current logged-in user
            shopping_list = List.objects.get(user=req.user)
            return JsonResponse({"shopping_list": model_to_dict(shopping_list)})
        except List.DoesNotExist:
            # If the user doesn't have a shopping list, return an empty list
            shopping_list = List(user=req.user, items=[])
            shopping_list.save()
            return JsonResponse({"shopping_list": model_to_dict(shopping_list)})

    elif req.method == "POST":
        # If the request is POST, create a new shopping list or update the existing one
        body = json.loads(req.body)
        shopping_list, created = List.objects.get_or_create(user=req.user)
        shopping_list.items = body.get("items", [])
        shopping_list.save()
        return JsonResponse({"shopping_list": model_to_dict(shopping_list)})

    else:
        return JsonResponse({"error": "Invalid HTTP method. Only GET and POST are allowed."}, status=405)
    
@login_required
@csrf_protect
def add_to_shopping_list(req):
    if req.method == "POST":
        body = json.loads(req.body)
        item = body["item"]

        shopping_list = List.objects.get(user=req.user)
        shopping_list.items.append(item)  # Add the item to the list

        shopping_list.save()  # Save the updated shopping list

        return JsonResponse({"shopping_list": shopping_list.items})
    
    return JsonResponse({"error": "Invalid method"}, status=405)

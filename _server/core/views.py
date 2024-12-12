from django.shortcuts import render
from django.conf import settings
import json
import os
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.forms.models import model_to_dict
from .models import Recipe, Tag

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

def get_tags(req):
    tags = list(Tag.objects.values('name'))
    return JsonResponse(tags, safe=False)
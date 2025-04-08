def get_career_recommendation(data):
    # Dummy logic - replace with ML or AI integration
    skills = data.get("skills", [])
    interests = data.get("interests", [])
    qualification = data.get("qualification", "")

    if "coding" in interests or "programming" in skills:
        return "Software Developer"
    elif "design" in interests:
        return "UI/UX Designer"
    elif "teaching" in interests:
        return "Educator"
    else:
        return "General Analyst"

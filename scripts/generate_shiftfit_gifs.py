from __future__ import annotations

import math
from pathlib import Path
from typing import Dict, List, Tuple

from PIL import Image, ImageChops, ImageDraw


ROOT = Path(r"C:\Users\carl\Documents\New project 4")
SOURCE = Path(r"C:\Users\carl\Desktop\Complete.png")
OUT_DIR = ROOT / "outputs" / "gifs"
PREVIEW = ROOT / "outputs" / "preview-sheet.png"

CANVAS = (512, 512)
BACKGROUND = (245, 247, 250, 255)
FPS = 12
FRAME_COUNT = 24


def load_crop() -> Image.Image:
    img = Image.open(SOURCE).convert("RGBA")
    bbox = img.getchannel("A").getbbox()
    if not bbox:
        raise RuntimeError("Source image has no visible pixels.")
    crop = img.crop(bbox)
    return crop


def polygon_mask(size: Tuple[int, int], points: List[Tuple[int, int]]) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).polygon(points, fill=255)
    return mask


def cut_part(img: Image.Image, points: List[Tuple[int, int]]) -> Image.Image:
    mask = polygon_mask(img.size, points)
    out = Image.new("RGBA", img.size, (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out


def build_parts(crop: Image.Image) -> Dict[str, Image.Image]:
    core_poly = [
        (88, 0), (292, 0), (330, 108), (316, 290), (300, 612), (278, 760),
        (90, 760), (70, 620), (60, 290), (48, 108)
    ]
    l_upper_arm = [(18, 252), (102, 250), (98, 495), (18, 505)]
    l_forearm = [(12, 450), (90, 446), (94, 700), (6, 700)]
    r_upper_arm = [(268, 252), (352, 252), (356, 506), (274, 500)]
    r_forearm = [(282, 446), (360, 450), (364, 702), (274, 704)]
    l_thigh = [(96, 650), (175, 650), (184, 878), (92, 882)]
    r_thigh = [(192, 650), (276, 650), (280, 882), (188, 878)]
    l_shin = [(78, 846), (182, 844), (175, 1038), (58, 1038)]
    r_shin = [(190, 844), (306, 846), (322, 1038), (202, 1038)]

    return {
        "core": cut_part(crop, core_poly),
        "l_upper_arm": cut_part(crop, l_upper_arm),
        "l_forearm": cut_part(crop, l_forearm),
        "r_upper_arm": cut_part(crop, r_upper_arm),
        "r_forearm": cut_part(crop, r_forearm),
        "l_thigh": cut_part(crop, l_thigh),
        "r_thigh": cut_part(crop, r_thigh),
        "l_shin": cut_part(crop, l_shin),
        "r_shin": cut_part(crop, r_shin),
    }


PIVOTS = {
    "l_upper_arm": (82, 286),
    "r_upper_arm": (289, 286),
    "l_forearm": (58, 470),
    "r_forearm": (314, 470),
    "l_thigh": (143, 674),
    "r_thigh": (226, 674),
    "l_shin": (144, 850),
    "r_shin": (228, 850),
}


def rotate_canvas(img: Image.Image, angle: float, center: Tuple[int, int]) -> Image.Image:
    return img.rotate(angle, resample=Image.Resampling.BICUBIC, center=center)


def translate_canvas(img: Image.Image, dx: float = 0, dy: float = 0) -> Image.Image:
    return img.transform(
        img.size,
        Image.Transform.AFFINE,
        (1, 0, dx, 0, 1, dy),
        resample=Image.Resampling.BICUBIC,
        fillcolor=(0, 0, 0, 0),
    )


def eased_cycle(i: int, total: int) -> float:
    t = i / total
    return 0.5 - 0.5 * math.cos(t * math.tau)


def sin_cycle(i: int, total: int) -> float:
    t = i / total
    return math.sin(t * math.tau)


def draw_dumbbell(draw: ImageDraw.ImageDraw, x: float, y: float, size: int = 18) -> None:
    bar = 10
    plate_w = size // 3
    plate_h = size
    draw.rounded_rectangle((x - bar / 2, y - 2, x + bar / 2, y + 2), radius=2, fill=(65, 76, 94, 255))
    draw.rounded_rectangle((x - bar / 2 - plate_w, y - plate_h / 2, x - bar / 2, y + plate_h / 2), radius=3, fill=(36, 42, 53, 255))
    draw.rounded_rectangle((x + bar / 2, y - plate_h / 2, x + bar / 2 + plate_w, y + plate_h / 2), radius=3, fill=(36, 42, 53, 255))


def draw_barbell(draw: ImageDraw.ImageDraw, x1: float, y1: float, x2: float, y2: float) -> None:
    draw.line((x1, y1, x2, y2), fill=(70, 76, 90, 255), width=6)
    for x, y in [(x1, y1), (x2, y2)]:
        draw.rounded_rectangle((x - 10, y - 18, x - 3, y + 18), radius=3, fill=(35, 41, 50, 255))
        draw.rounded_rectangle((x + 3, y - 18, x + 10, y + 18), radius=3, fill=(35, 41, 50, 255))


def draw_band(draw: ImageDraw.ImageDraw, pts: Tuple[float, float, float, float], color=(54, 110, 209, 255), width: int = 8) -> None:
    draw.line(pts, fill=color, width=width)


def draw_goblet(draw: ImageDraw.ImageDraw, x: float, y: float) -> None:
    draw.rounded_rectangle((x - 15, y - 22, x + 15, y + 22), radius=6, fill=(44, 52, 65, 255))
    draw.rounded_rectangle((x - 8, y - 28, x + 8, y - 20), radius=3, fill=(62, 73, 91, 255))


def draw_wall(draw: ImageDraw.ImageDraw) -> None:
    draw.rounded_rectangle((360, 70, 470, 470), radius=18, fill=(224, 229, 236, 255))


def compose_frame(parts: Dict[str, Image.Image], state: Dict[str, float], exercise: str) -> Image.Image:
    frame = Image.new("RGBA", parts["core"].size, (0, 0, 0, 0))
    core = translate_canvas(parts["core"], state.get("core_dx", 0), state.get("core_dy", 0))
    frame.alpha_composite(core)

    ordered = [
        "l_thigh", "r_thigh", "l_shin", "r_shin",
        "l_upper_arm", "r_upper_arm", "l_forearm", "r_forearm",
    ]
    for name in ordered:
        layer = parts[name]
        angle = state.get(f"{name}_rot", 0)
        pivot = PIVOTS[name]
        moved = rotate_canvas(layer, angle, pivot)
        moved = translate_canvas(moved, state.get(f"{name}_dx", state.get("core_dx", 0)), state.get(f"{name}_dy", state.get("core_dy", 0)))
        frame.alpha_composite(moved)

    canvas = Image.new("RGBA", CANVAS, BACKGROUND)
    scaled = frame.resize((182, 510), Image.Resampling.LANCZOS)
    canvas.alpha_composite(scaled, (165, 2))

    draw = ImageDraw.Draw(canvas)
    left_hand = (
        165 + int((58 + state.get("left_hand_dx", 0)) * 182 / 371),
        2 + int((650 + state.get("left_hand_dy", 0) + state.get("core_dy", 0)) * 510 / 1038),
    )
    right_hand = (
        165 + int((314 + state.get("right_hand_dx", 0)) * 182 / 371),
        2 + int((650 + state.get("right_hand_dy", 0) + state.get("core_dy", 0)) * 510 / 1038),
    )

    if exercise in {"Dumbbell Curl", "Hammer Curl", "Lateral Raise", "Dumbbell Shoulder Press", "Dumbbell Squat"}:
        draw_dumbbell(draw, *left_hand)
        draw_dumbbell(draw, *right_hand)
    elif exercise in {"Barbell Curl", "Overhead Press"}:
        draw_barbell(draw, *left_hand, *right_hand)
    elif exercise in {"Band Pull Apart", "Band Curl", "Band Overhead Press"}:
        draw_band(draw, (*left_hand, *right_hand))
    elif exercise == "Goblet Squat":
        cx = (left_hand[0] + right_hand[0]) / 2
        cy = (left_hand[1] + right_hand[1]) / 2 - 8
        draw_goblet(draw, cx, cy)
    elif exercise == "Wall Sit":
        draw_wall(draw)

    return canvas


def state_for(exercise: str, i: int) -> Dict[str, float]:
    p = eased_cycle(i, FRAME_COUNT)
    bob = sin_cycle(i, FRAME_COUNT)
    state: Dict[str, float] = {}

    if exercise == "Dumbbell Curl":
        state["l_forearm_rot"] = 115 * p
        state["r_forearm_rot"] = -115 * p
        state["left_hand_dy"] = -160 * p
        state["right_hand_dy"] = -160 * p
    elif exercise == "Hammer Curl":
        state["l_forearm_rot"] = 100 * p
        state["r_forearm_rot"] = -100 * p
        state["left_hand_dy"] = -150 * p
        state["right_hand_dy"] = -150 * p
    elif exercise == "Barbell Curl":
        state["l_forearm_rot"] = 98 * p
        state["r_forearm_rot"] = -98 * p
        state["left_hand_dy"] = -138 * p
        state["right_hand_dy"] = -138 * p
        state["left_hand_dx"] = 14 * p
        state["right_hand_dx"] = -14 * p
    elif exercise == "Lateral Raise":
        state["l_upper_arm_rot"] = -72 * p
        state["r_upper_arm_rot"] = 72 * p
        state["l_forearm_rot"] = -50 * p
        state["r_forearm_rot"] = 50 * p
        state["left_hand_dy"] = -130 * p
        state["right_hand_dy"] = -130 * p
        state["left_hand_dx"] = -40 * p
        state["right_hand_dx"] = 40 * p
    elif exercise == "Upright Row":
        state["l_upper_arm_rot"] = -25 * p
        state["r_upper_arm_rot"] = 25 * p
        state["l_forearm_rot"] = 72 * p
        state["r_forearm_rot"] = -72 * p
        state["left_hand_dy"] = -115 * p
        state["right_hand_dy"] = -115 * p
        state["left_hand_dx"] = 10 * p
        state["right_hand_dx"] = -10 * p
    elif exercise == "Overhead Press":
        state["l_upper_arm_rot"] = -78 * p
        state["r_upper_arm_rot"] = 78 * p
        state["l_forearm_rot"] = 66 * p
        state["r_forearm_rot"] = -66 * p
        state["left_hand_dy"] = -220 * p
        state["right_hand_dy"] = -220 * p
        state["left_hand_dx"] = 6 * p
        state["right_hand_dx"] = -6 * p
    elif exercise == "Dumbbell Shoulder Press":
        state["l_upper_arm_rot"] = -74 * p
        state["r_upper_arm_rot"] = 74 * p
        state["l_forearm_rot"] = 62 * p
        state["r_forearm_rot"] = -62 * p
        state["left_hand_dy"] = -206 * p
        state["right_hand_dy"] = -206 * p
        state["left_hand_dx"] = -8 + 4 * p
        state["right_hand_dx"] = 8 - 4 * p
    elif exercise == "Band Pull Apart":
        state["l_upper_arm_rot"] = -62 * p
        state["r_upper_arm_rot"] = 62 * p
        state["l_forearm_rot"] = -24 * p
        state["r_forearm_rot"] = 24 * p
        state["left_hand_dx"] = -85 * p
        state["right_hand_dx"] = 85 * p
        state["left_hand_dy"] = -42 * p
        state["right_hand_dy"] = -42 * p
    elif exercise == "Band Curl":
        state["l_forearm_rot"] = 100 * p
        state["r_forearm_rot"] = -100 * p
        state["left_hand_dy"] = -145 * p
        state["right_hand_dy"] = -145 * p
    elif exercise == "Band Overhead Press":
        state["l_upper_arm_rot"] = -76 * p
        state["r_upper_arm_rot"] = 76 * p
        state["l_forearm_rot"] = 68 * p
        state["r_forearm_rot"] = -68 * p
        state["left_hand_dy"] = -215 * p
        state["right_hand_dy"] = -215 * p
    elif exercise in {"Goblet Squat", "Dumbbell Squat", "Wall Sit"}:
        squat = p if exercise != "Wall Sit" else 0.75 + 0.02 * bob
        core_drop = 72 * squat
        state["core_dy"] = core_drop
        state["l_upper_arm_dy"] = core_drop
        state["r_upper_arm_dy"] = core_drop
        state["l_forearm_dy"] = core_drop
        state["r_forearm_dy"] = core_drop
        state["l_thigh_rot"] = 18 * squat
        state["r_thigh_rot"] = -18 * squat
        state["l_shin_rot"] = -24 * squat
        state["r_shin_rot"] = 24 * squat
        state["left_hand_dy"] = core_drop + (20 if exercise == "Goblet Squat" else 10)
        state["right_hand_dy"] = core_drop + (20 if exercise == "Goblet Squat" else 10)
        if exercise == "Dumbbell Squat":
            state["left_hand_dy"] = core_drop + 4
            state["right_hand_dy"] = core_drop + 4
        if exercise == "Wall Sit":
            state["core_dx"] = 62
            state["l_upper_arm_dx"] = 62
            state["r_upper_arm_dx"] = 62
            state["l_forearm_dx"] = 62
            state["r_forearm_dx"] = 62
            state["l_thigh_dx"] = 38
            state["r_thigh_dx"] = 38
            state["l_shin_dx"] = 18
            state["r_shin_dx"] = 18
    else:
        raise KeyError(f"Unknown exercise: {exercise}")

    return state


def render_gif(parts: Dict[str, Image.Image], exercise: str) -> Path:
    frames: List[Image.Image] = []
    for i in range(FRAME_COUNT):
        state = state_for(exercise, i)
        frames.append(compose_frame(parts, state, exercise))
    out_path = OUT_DIR / f"{exercise.lower().replace(' ', '-')}-front-v1.gif"
    frames[0].save(
        out_path,
        save_all=True,
        append_images=frames[1:],
        duration=int(1000 / FPS),
        loop=0,
        disposal=2,
    )
    return out_path


def render_preview(gif_paths: List[Path]) -> None:
    thumbs = []
    labels = []
    for path in gif_paths:
        img = Image.open(path)
        img.seek(0)
        thumb = img.convert("RGBA").resize((160, 160), Image.Resampling.LANCZOS)
        thumbs.append(thumb)
        labels.append(path.stem.replace("-front-v1", ""))

    sheet = Image.new("RGBA", (540, 4 * 180), (255, 255, 255, 255))
    draw = ImageDraw.Draw(sheet)
    for idx, (thumb, label) in enumerate(zip(thumbs, labels)):
        row = idx // 3
        col = idx % 3
        x = 10 + col * 175
        y = 10 + row * 180
        draw.rounded_rectangle((x, y, x + 165, y + 165), radius=18, fill=(245, 247, 250, 255), outline=(219, 225, 233, 255))
        sheet.alpha_composite(thumb, (x + 2, y + 2))
        draw.text((x + 10, y + 168), label, fill=(48, 57, 70, 255))
    PREVIEW.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(PREVIEW)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    crop = load_crop()
    parts = build_parts(crop)
    exercises = [
        "Dumbbell Curl",
        "Hammer Curl",
        "Barbell Curl",
        "Lateral Raise",
        "Upright Row",
        "Overhead Press",
        "Dumbbell Shoulder Press",
        "Band Pull Apart",
        "Band Curl",
        "Band Overhead Press",
        "Goblet Squat",
        "Dumbbell Squat",
        "Wall Sit",
    ]
    paths = [render_gif(parts, name) for name in exercises]
    render_preview(paths)
    for path in paths:
        print(path)
    print(PREVIEW)


if __name__ == "__main__":
    main()

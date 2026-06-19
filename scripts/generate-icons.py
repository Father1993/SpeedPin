#!/usr/bin/env python3
"""Generate SpeedPin extension icons (stdlib only, no dependencies)."""

import os
import struct
import zlib

BG = (99, 102, 241)
HEAD = (255, 255, 255)
PIN = (139, 92, 246)


def _chunk(tag: bytes, data: bytes) -> bytes:
    return (
        struct.pack(">I", len(data))
        + tag
        + data
        + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    )


def _set_px(row: bytearray, x: int, rgb: tuple[int, int, int]) -> None:
    i = 1 + x * 3
    row[i : i + 3] = bytes(rgb)


def _render(size: int) -> list[bytearray]:
    rows = [bytearray(b"\x00" + bytes(BG) * size) for _ in range(size)]
    cx, cy = size // 2, size // 3
    r = max(2, size // 5)
    r2 = r * r
    pin_w = max(1, size // 14)

    for y in range(size):
        for x in range(size):
            if (x - cx) ** 2 + (y - cy) ** 2 <= r2:
                _set_px(rows[y], x, HEAD)
            elif cy + r <= y <= int(size * 0.88) and abs(x - cx) <= pin_w:
                _set_px(rows[y], x, PIN)

    return rows


def write_png(path: str, size: int) -> None:
    raw = b"".join(_render(size))
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0)
    png = (
        b"\x89PNG\r\n\x1a\n"
        + _chunk(b"IHDR", ihdr)
        + _chunk(b"IDAT", zlib.compress(raw, 9))
        + _chunk(b"IEND", b"")
    )
    with open(path, "wb") as f:
        f.write(png)


def main() -> None:
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    icons_dir = os.path.join(root, "icons")
    os.makedirs(icons_dir, exist_ok=True)
    for size in (16, 48, 128):
        path = os.path.join(icons_dir, f"icon{size}.png")
        write_png(path, size)
        print(f"Created {path}")


if __name__ == "__main__":
    main()

"""
Sentinel-2 Super Resolution model architecture.

This is an exact copy of the architecture provided by the AI/ML team in
`sentinel2_sr_model_deployment_package/model.py`. It MUST stay identical
to whatever architecture the .pth weights were trained with, or
`load_state_dict` will fail (or silently load garbage if shapes happen
to line up but layer names don't - strict=True protects us from that).

Spec (from AI teammate's README):
- 4 input channels: B02, B03, B04, B08
- 4 output channels
- 64 features
- 8 residual blocks
- 4x upscaling
- 927,876 parameters
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


class ResidualBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.block = nn.Sequential(
            nn.Conv2d(channels, channels, 3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(channels, channels, 3, padding=1),
        )

    def forward(self, x):
        return x + self.block(x)


class Sentinel2SR(nn.Module):
    def __init__(self, in_channels=4, out_channels=4, features=64, num_blocks=8):
        super().__init__()
        self.head = nn.Conv2d(in_channels, features, 3, padding=1)
        self.body = nn.Sequential(
            *[ResidualBlock(features) for _ in range(num_blocks)]
        )
        self.body_conv = nn.Conv2d(features, features, 3, padding=1)
        self.upsample = nn.Sequential(
            nn.Conv2d(features, features * 4, 3, padding=1),
            nn.PixelShuffle(2),
            nn.ReLU(inplace=True),
            nn.Conv2d(features, features * 4, 3, padding=1),
            nn.PixelShuffle(2),
            nn.ReLU(inplace=True),
        )
        self.tail = nn.Conv2d(features, out_channels, 3, padding=1)

    def forward(self, x):
        x_head = self.head(x)
        x_body = self.body(x_head)
        x_body = self.body_conv(x_body)
        features = x_head + x_body
        sr = self.tail(self.upsample(features))
        baseline = F.interpolate(
            x, scale_factor=4, mode="bilinear", align_corners=False
        )
        return sr + baseline

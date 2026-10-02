import torch
import torch.nn as nn


class SRCNN(nn.Module):

    def __init__(self, in_channels=4, out_channels=4):

        super(SRCNN, self).__init__()

        self.network = nn.Sequential(

            # Feature extraction
            nn.Conv2d(
                in_channels,
                64,
                kernel_size=9,
                padding=4
            ),
            nn.ReLU(inplace=True),

            # Non-linear mapping
            nn.Conv2d(
                64,
                32,
                kernel_size=5,
                padding=2
            ),
            nn.ReLU(inplace=True),

            # Reconstruction
            nn.Conv2d(
                32,
                out_channels,
                kernel_size=5,
                padding=2
            )
        )

    def forward(self, x):

        return self.network(x)


if __name__ == "__main__":

    # Create model for 4 Sentinel-2 bands
    model = SRCNN(
        in_channels=4,
        out_channels=4
    )

    # Test input
    test_input = torch.randn(
        1,
        4,
        128,
        128
    )

    output = model(test_input)

    print("SRCNN model created successfully!")
    print("Input shape :", test_input.shape)
    print("Output shape:", output.shape)
    print("Parameters  :", sum(
        p.numel() for p in model.parameters()
    ))
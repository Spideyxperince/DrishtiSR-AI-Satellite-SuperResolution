<div align="center">

<img src="assets/sentinel2sr-pipeline.svg" alt="DrishtiSR pipeline: Sentinel-2 10 m input, paired patches, Sentinel2SR, 2.5 m output" width="100%" />

# DrishtiSR

### AI-powered 4× super-resolution for Sentinel-2 satellite imagery

[![Problem](https://img.shields.io/badge/SIH%202026-Problem%20Statement%20142-0b7285?style=for-the-badge)](https://www.sih.gov.in/)
![Task](https://img.shields.io/badge/Task-Satellite%20Super--Resolution-1f6feb?style=for-the-badge)
![Scale](https://img.shields.io/badge/Resolution-10%20m%20%E2%86%92%202.5%20m-20a67a?style=for-the-badge)
![Model](https://img.shields.io/badge/Model-Sentinel2SR-7c3aed?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)

*Turning medium-resolution Sentinel-2 observations into a finer, model-reconstructed 2.5 m product—while keeping the scientific limits of super-resolution visible.*

</div>

> **Research note:** Super-resolution reconstructs plausible fine detail from learned patterns; it is not a substitute for a direct 2.5 m satellite observation. Outputs should be validated before high-stakes geospatial use.

## Why DrishtiSR?

Sentinel-2 provides globally useful, openly available imagery at 10 m resolution, but many planning and mapping workflows need more local detail. Conventional interpolation can enlarge an image, but it cannot learn the spatial patterns present in paired high-resolution reference imagery.

DrishtiSR is a deep-learning super-resolution project for **4× spatial enhancement: 10 m → 2.5 m**. It learns from paired low-/high-resolution samples using the **Sentinel2SR** architecture and a joint **pixel + spectral** objective.

## At a glance

| Item | Current project fact |
| --- | --- |
| Input | Sentinel-2 imagery at 10 m resolution |
| Output | 2.5 m reconstructed imagery (4× spatial scale) |
| Training data | Paired low-/high-resolution samples from SEN2NAIPv2 |
| Model | Sentinel2SR |
| Objective | Pixel reconstruction loss + spectral consistency loss |
| Reported held-out result | **PSNR: 33.607 dB** |
| License | MIT |

## End-to-end pipeline

```mermaid
flowchart LR
    A[Sentinel-2 image<br/>10 m] --> B[Paired LR / HR samples]
    B --> C[Patch preparation]
    C --> D[Sentinel2SR]
    D --> E[Pixel loss + spectral loss]
    E --> F[4× reconstruction]
    F --> G[Super-resolved image<br/>2.5 m]

    classDef input fill:#0b3a53,color:#fff,stroke:#56c8ef,stroke-width:2px
    classDef model fill:#3f257f,color:#fff,stroke:#b7a1ff,stroke-width:2px
    classDef output fill:#0d604a,color:#fff,stroke:#57e0b3,stroke-width:2px
    class A,B,C input
    class D,E model
    class F,G output
```

<details>
<summary><strong>How to read the flow</strong></summary>

1. **Input:** Sentinel-2 provides the 10 m source imagery.
2. **Learning signal:** paired low-/high-resolution samples teach the network the desired 4× mapping.
3. **Model:** Sentinel2SR predicts the finer grid.
4. **Losses:** pixel loss rewards reconstruction fidelity; spectral loss helps preserve inter-band relationships.
5. **Output:** a 2.5 m model-reconstructed image, evaluated with standard image-quality metrics.
</details>

## Model and training

### Sentinel2SR architecture

The project uses **Sentinel2SR**, a super-resolution network trained to map low-resolution Sentinel-2 patches to their higher-resolution counterparts. The model is optimized with two complementary signals:

- **Pixel loss** — encourages accurate per-pixel reconstruction.
- **Spectral loss** — encourages consistency between spectral responses, an important constraint for satellite imagery.

### Data

Training and evaluation use paired samples from **SEN2NAIPv2**. Pairing the low-resolution and higher-resolution observations lets the model learn a supervised 4× mapping rather than relying on interpolation alone.

## Results

The current held-out test run reports:

<div align="center">

| Metric | Result |
| :--- | ---: |
| **PSNR** | **33.607 dB** |

</div>

PSNR measures reconstruction fidelity in decibels; it is **not a percentage improvement**. A direct “improvement over bicubic” claim should only be added after the same test subset has been evaluated with the bicubic baseline.

<!--
When you have images, replace this comment with real, versioned project assets:

<p align="center">
  <img src="assets/results/comparison.png" alt="Sentinel-2 input, bicubic baseline, DrishtiSR reconstruction, and reference" width="100%" />
</p>

Recommended comparison order: 10 m input | bicubic 4× | DrishtiSR 4× | paired reference.
-->

## Repository layout

This layout reflects the directories currently tracked in the repository. Most are intentionally empty scaffolding directories until the corresponding implementation and artifacts are added.

```text
.
├── ai/             # Model architecture, training, and inference code (to be added)
├── backend/        # Service layer (to be added)
├── config/         # Experiment/configuration files (to be added)
├── data/
│   ├── raw/        # Source data (not committed)
│   ├── processed/  # Derived data (not committed)
│   ├── train/      # Training split (not committed)
│   ├── val/        # Validation split (not committed)
│   └── test/       # Test split (not committed)
├── deployment/     # Deployment configuration (to be added)
├── experiments/    # Experiment logs and evaluation summaries (to be added)
├── frontend/       # User interface (to be added)
├── geospatial/     # Geospatial utilities (to be added)
├── models/         # Checkpoint documentation/download instructions (to be added)
├── notebooks/      # Exploratory and training notebooks (to be added)
├── reports/        # Figures and reports (to be added)
├── scripts/        # Reproducible training/evaluation commands (to be added)
├── tests/          # Tests (to be added)
├── assets/         # README visuals
└── README.md
```

## Getting started

```bash
git clone https://github.com/Spideyxperince/DrishtiSR-AI-Satellite-SuperResolution.git
cd DrishtiSR-AI-Satellite-SuperResolution
```

The repository currently contains the project scaffold rather than a runnable training or inference implementation. As model code, dependency pins, checkpoints, and scripts are published, this section should be updated with **verified commands only**.

### Reproducibility checklist

- [ ] Publish the training/inference source code under `ai/`.
- [ ] Add pinned dependencies to `requirements.txt`.
- [ ] Add a dataset-preparation note without committing restricted or large data.
- [ ] Add checkpoint download location and checksum under `models/`.
- [ ] Add the exact evaluation script and seeded held-out split.
- [ ] Report bicubic-baseline metrics on that same split.

## Demo and visual evidence

Add visual evidence once it is available; do not use stock satellite images as model-output proof.

| Asset | What it should show | Suggested path |
| --- | --- | --- |
| Before/after panel | Same geographic crop at input, bicubic, DrishtiSR, and reference | `assets/results/comparison.png` |
| Short demo | Upload → process → comparison workflow | `assets/demo.gif` |
| Training curve | Training/validation loss and PSNR by epoch | `assets/results/training-curves.png` |
| Qualitative crops | Roads, field boundaries, roofs, water edges | `assets/results/crops.png` |

## Limitations

- Fine details are **model-inferred**, not newly observed by Sentinel-2.
- Results can vary by geography, land cover, season, atmosphere, and sensor pairing.
- A high PSNR alone does not establish downstream usefulness; visual and task-specific validation remain necessary.
- The reported PSNR does not yet include a published bicubic-baseline comparison on the same held-out samples.
- The scaffold does not yet publish the implementation needed for independent reproduction.

## Roadmap

- [ ] Publish Sentinel2SR training and inference code.
- [ ] Release a reproducible checkpoint and evaluation protocol.
- [ ] Benchmark against bicubic on the identical test subset.
- [ ] Add qualitative comparisons and training plots.
- [ ] Add geospatial export/metadata validation, if implemented.
- [ ] Evaluate robustness across locations and seasons.

## Team and contact

Built for **Smart India Hackathon 2026 — Problem Statement 142**.

- Repository: [Spideyxperince/DrishtiSR-AI-Satellite-SuperResolution](https://github.com/Spideyxperince/DrishtiSR-AI-Satellite-SuperResolution)
- Maintainer: [@Spideyxperince](https://github.com/Spideyxperince)

For collaboration or questions, please open a GitHub issue.

## License

This project is released under the [MIT License](LICENSE).

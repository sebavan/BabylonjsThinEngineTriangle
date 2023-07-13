import { ThinEngine } from "@babylonjs/core/Engines/thinEngine";
import { EffectWrapper, EffectRenderer } from "@babylonjs/core/Materials/effectRenderer";
import { ThinTexture } from "@babylonjs/core";

import blitFragment from "./blit.glsl";

export class BlitEffect {
    private readonly _effectRenderer: EffectRenderer;
    private readonly _effectWrapper: EffectWrapper;

    constructor(engine: ThinEngine, renderer: EffectRenderer) {
        this._effectRenderer = renderer;
        this._effectWrapper = new EffectWrapper({
            name: "blit",
            engine: engine,
            fragmentShader: blitFragment,
            samplerNames: ["textureSampler"],
            uniformNames: ["invertY"],
        });
    }

    public blit(thinTexture: ThinTexture, invertY = false): void {
        this._effectRenderer.setViewport();
        this._effectRenderer.applyEffectWrapper(this._effectWrapper);
        this._effectWrapper.effect.setTexture("textureSampler", thinTexture);
        this._effectWrapper.effect.setFloat("invertY", invertY ? 1.0 : 0.0);
        this._effectRenderer.draw();
    }

    public dispose(): void {
        this._effectWrapper.dispose();
    }
}
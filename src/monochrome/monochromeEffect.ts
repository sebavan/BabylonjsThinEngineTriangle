import { EffectWrapper, EffectRenderer } from "@babylonjs/core/Materials/effectRenderer";
import { ThinEngine } from "@babylonjs/core/Engines/thinEngine";
import { Constants } from "@babylonjs/core/Engines/constants";
import { ThinRenderTargetTexture } from "@babylonjs/core/Materials/Textures/thinRenderTargetTexture";

import "@babylonjs/core/Engines/Extensions/engine.renderTarget";

import fragmentShader from "./monochromeFragment.glsl";

export class MonochromeEffect {
    public readonly rtw: ThinRenderTargetTexture;

    private readonly _engine: ThinEngine;
    private readonly _effectRenderer: EffectRenderer;
    private readonly _effectWrapper: EffectWrapper;

    constructor(engine: ThinEngine, effectRenderer: EffectRenderer, size = 256) {
        this._engine = engine;
        this._effectRenderer = effectRenderer;
        this._effectWrapper = this._getEffect();

        this.rtw = this._createRenderTarget(size);
    }

    public render(thinTexture: ThinRenderTargetTexture): void {
        this._engine.bindFramebuffer(this.rtw.renderTarget);
        this._effectRenderer.applyEffectWrapper(this._effectWrapper);
        this._effectWrapper.effect.setTexture("textureSampler", thinTexture);
        this._effectRenderer.draw();
        this._engine.unBindFramebuffer(this.rtw.renderTarget);
    }

    public dispose(): void {
        this._effectWrapper.dispose();
        this.rtw.dispose();
    }

    private _getEffect(): EffectWrapper {
        const effectWrapper = new EffectWrapper({
            engine: this._engine,
            name: "monochrome",
            fragmentShader,
            samplerNames: ["textureSampler"]
        });

        return effectWrapper;
    }

    private _createRenderTarget(size: number): ThinRenderTargetTexture {
        const rtw = new ThinRenderTargetTexture(this._engine, size, {
            format: Constants.TEXTUREFORMAT_RGBA,
            type: Constants.TEXTURETYPE_FLOAT,
            generateMipMaps: false,
            generateDepthBuffer: false,
            generateStencilBuffer: false,
            samplingMode: Constants.TEXTURE_NEAREST_SAMPLINGMODE
        });
        return rtw;
    }
}
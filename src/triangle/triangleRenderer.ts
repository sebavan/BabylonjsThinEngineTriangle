import { EffectWrapper } from "@babylonjs/core/Materials/effectRenderer";
import { ThinEngine } from "@babylonjs/core/Engines/thinEngine";
import { Constants } from "@babylonjs/core/Engines/constants";
import { ThinRenderTargetTexture } from "@babylonjs/core/Materials/Textures/thinRenderTargetTexture";
import { VertexBuffer } from "@babylonjs/core/Buffers/buffer";

import "@babylonjs/core/Engines/Extensions/engine.renderTarget";

import vertexShader from "./triangleVertex.glsl";
import fragmentShader from "./triangleFragment.glsl";

const clearColor = { r: 0.0, g: 0.0, b: 0.0, a: 1.0};

export class TriangleRenderer {
    public readonly rtw: ThinRenderTargetTexture;

    private readonly _engine: ThinEngine;
    private readonly _effectWrapper: EffectWrapper;
    private readonly _vertexBuffers: { [key: string]: VertexBuffer };

    constructor(engine: ThinEngine, size = 256) {
        this._engine = engine;
        this._effectWrapper = this._getEffect();

        const position = new VertexBuffer(engine, [0, 0.5, -0.5, -0.5, 0.5, -0.5], "position", true, false, 2, false);
        this._vertexBuffers = {
            position
        };

        this.rtw = this._createRenderTarget(size);
    }

    public render(): void {
        this._engine.bindFramebuffer(this.rtw.renderTarget);
        this._engine.clear(clearColor, true, true, true);
        this._engine.enableEffect(this._effectWrapper.effect);
        this._engine.bindBuffers(this._vertexBuffers, null, this._effectWrapper.effect);
        this._engine.drawUnIndexed(true, 0, 3);
        this._engine.unBindFramebuffer(this.rtw.renderTarget);
    }

    public dispose(): void {
        this.rtw.dispose();
        this._effectWrapper.dispose();
        this._vertexBuffers["position"].dispose();
    }

    private _getEffect(): EffectWrapper {
        const effectWrapper = new EffectWrapper({
            engine: this._engine,
            name: "triangle",
            vertexShader,
            fragmentShader
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
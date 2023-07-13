import { ThinEngine } from "@babylonjs/core/Engines/thinEngine";
import { EffectRenderer } from "@babylonjs/core/Materials/effectRenderer";

import { BlitEffect } from "./blit/blitEffect";
import { TriangleRenderer } from "./triangle/triangleRenderer";
import { MonochromeEffect } from "./monochrome/monochromeEffect";

/**
 * The demo renderer is responsible to create and orchestrate all the resources
 * needed to render the multiple effects
 */
export class DemoRenderer {
    public readonly engine: ThinEngine;

    private readonly _renderer: EffectRenderer;

    private readonly _triangleRenderer: TriangleRenderer;
    private readonly _monochromeEffect: MonochromeEffect;
    private readonly _blitEffect: BlitEffect;

    /**
     * Creates an instance of the Triangle class associated to a html canvas element
     * @param canvas defines the html element to draw into
     */
    constructor(engine: ThinEngine) {
        this.engine = engine;
        this.engine.getCaps().parallelShaderCompile = undefined;

        this._renderer = new EffectRenderer(this.engine);

        this._triangleRenderer = new TriangleRenderer(this.engine);
        this._monochromeEffect = new MonochromeEffect(this.engine, this._renderer);
        this._blitEffect = new BlitEffect(this.engine, this._renderer);
    }

    /**
     * Starts rendering.
     */
    public start(): void {
        this.engine.runRenderLoop(() => {
            this._triangleRenderer.render();
            this._monochromeEffect.render(this._triangleRenderer.rtw);
            this._blitEffect.blit(this._monochromeEffect.rtw);
        });
    }

    /**
     * Stops rendering.
     */
    public stop(): void {
        this.engine.stopRenderLoop();
    }

    /**
     * Disposes the resources associated with the engine.
     */
    public dispose(): void {
        this.stop();
        this._triangleRenderer.dispose();
        this._monochromeEffect.dispose();
        this._blitEffect.dispose();
    }
}

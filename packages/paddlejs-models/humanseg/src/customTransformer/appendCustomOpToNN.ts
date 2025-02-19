/**
 * @file add deal origin op
 */

import { Transformer, env, interfaces } from '@paddlejs/paddlejs-core';

const IMG_ORIGIN = 'image';
const FINAL_PACK_OP_NAME = 'fetch_pack';

const WIDTH = 500;
const HEIGHT = 280;

export default class DealOrigin extends Transformer {

    constructor() {
        super('DealOrigin');
    }

    transform(...args: any) {
        if (!env.get('webgl_gpu_pipeline')) {
            return;
        }
        const [ops, vars] = args;
        const fetchOp = ops.find(item => item.type === 'fetch');
        const [inputName] = fetchOp.inputs.X;

        const segImgOp = {
            attrs: {},
            inputs: {
                X: [inputName],
                Y: [IMG_ORIGIN]
            },
            outputs: {
                Out: [FINAL_PACK_OP_NAME]
            },
            type: 'segImg',
            isPacked: true,
            bufferType: interfaces.BufferType.ColorBuffer,
            uniform: {
                type: {
                    type: '1i',
                    value: 0
                }
            }
        };


        const packOutVar = {
            name: FINAL_PACK_OP_NAME,
            shape: [1, 1, HEIGHT, WIDTH],
            persistable: false
        };

        fetchOp.inputs.X = [FINAL_PACK_OP_NAME];
        ops.push(segImgOp);
        vars.push(...[packOutVar]);
    }
}
// Copyright 2021 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// During Turbofan optimizations, when a TrapIf/Unless node is found to always
// trap, its uses need to be marked as dead. However, in the case that one of
// these uses is a Merge or Loop node, only the input of the Merge/Loop that
// corresponds to the trap should be marked as dead.

d8.file.execute('test/mjsunit/wasm/wasm-module-builder.js');

var builder = new WasmModuleBuilder();

builder.addStruct([makeField(kWasmI32, true)]);

builder.addFunction('test', makeSig([wasmRefNullType(0)], [kWasmI32]))
    .addBody([
      kExprLocalGet, 0,
      kExprRefIsNull,
      kExprIf, kWasmI32,
        kExprLocalGet, 0,
        kGCPrefix, kExprStructGet, 0, 0,
      kExprElse,
        kExprI32Const, 42,
      kExprEnd
    ])
    .exportFunc();
builder.instantiate();

// We include a clusterfuzz-generated testcase for this error verbatim.
const module = new WebAssembly.Module(new Uint8Array([
  0,   97,  115, 109, 1,   0,   0,   0,   1,   51,  9,   96,  0,   0,   96,
  0,   1,   125, 96,  0,   1,   124, 96,  2,   124, 127, 1,   125, 96,  4,
  126, 126, 125, 127, 1,   127, 96,  1,   126, 1,   127, 96,  7,   127, 126,
  126, 125, 124, 127, 125, 1,   124, 96,  0,   1,   127, 96,  1,   124, 1,
  125, 3,   23,  22,  0,   4,   0,   5,   6,   0,   7,   0,   2,   0,   3,
  1,   0,   8,   0,   0,   0,   0,   0,   2,   2,   0,   4,   5,   1,   112,
  1,   9,   9,   5,   4,   1,   3,   1,   1,   6,   6,   1,   127, 1,   65,
  10,  11,  7,   213, 1,   14,  6,   102, 117, 110, 99,  95,  48,  0,   0,
  14,  102, 117, 110, 99,  95,  49,  95,  105, 110, 118, 111, 107, 101, 114,
  0,   2,   14,  102, 117, 110, 99,  95,  52,  95,  105, 110, 118, 111, 107,
  101, 114, 0,   5,   14,  102, 117, 110, 99,  95,  54,  95,  105, 110, 118,
  111, 107, 101, 114, 0,   7,   14,  102, 117, 110, 99,  95,  56,  95,  105,
  110, 118, 11,  107, 101, 114, 0,   9,   7,   102, 117, 110, 99,  95,  49,
  49,  0,   11,  15,  102, 117, 110, 99,  95,  49,  49,  95,  105, 110, 118,
  111, 107, 101, 114, 0,   12,  15,  102, 117, 110, 99,  95,  49,  51,  95,
  105, 110, 118, 111, 107, 101, 114, 0,   14,  7,   102, 117, 110, 99,  95,
  49,  53,  0,   15,  15,  102, 117, 110, 99,  95,  49,  53,  95,  105, 110,
  118, 111, 107, 101, 114, 0,   16,  15,  102, 117, 110, 99,  95,  49,  55,
  95,  105, 110, 118, 111, 107, 101, 114, 0,   18,  7,   102, 117, 110, 99,
  95,  49,  57,  0,   19,  7,   102, 117, 110, 99,  95,  50,  48,  0,   20,
  20,  104, 97,  110, 103, 76,  105, 109, 105, 116, 73,  110, 105, 116, 105,
  97,  108, 105, 122, 101, 114, 0,   21,  9,   15,  1,   0,   65,  0,   11,
  9,   4,   6,   6,   8,   10,  11,  11,  15,  15,  10,  220, 18,  22,  113,
  0,   35,  0,   69,  4,   64,  15,  11,  35,  0,   65,  1,   107, 36,  0,
  3,   64,  35,  0,   69,  4,   64,  15,  11,  35,  0,   65,  1,   107, 36,
  0,   2,   127, 35,  0,   69,  4,   64,  15,  11,  35,  0,   65,  1,   107,
  36,  0,   65,  128, 128, 128, 4,   11,  4,   127, 65,  193, 255, 3,   5,
  2,   127, 3,   64,  35,  0,   69,  4,   64,  15,  11,  35,  0,   65,  1,
  107, 36,  0,   3,   64,  35,  0,   69,  4,   64,  15,  11,  35,  0,   65,
  1,   107, 36,  0,   12,  1,   11,  0,   65,  0,   13,  1,   0,   11,  0,
  11,  11,  26,  12,  0,   11,  0,   11,  131, 3,   1,   1,   125, 35,  0,
  69,  4,   64,  65,  128, 128, 128, 2,   15,  11,  35,  0,   65,  1,   107,
  36,  0,   2,   127, 2,   64,  66,  157, 228, 193, 147, 127, 3,   126, 35,
  0,   69,  4,   64,  65,  224, 196, 126, 15,  11,  35,  0,   65,  1,   107,
  36,  0,   35,  0,   69,  4,   64,  65,  129, 128, 124, 15,  11,  35,  0,
  65,  1,   107, 36,  0,   32,  3,   65,  105, 13,  2,   13,  0,   66,  128,
  128, 128, 128, 192, 0,   11,  2,   125, 35,  0,   69,  4,   64,  32,  3,
  15,  11,  35,  0,   65,  1,   107, 36,  0,   67,  0,   0,   80,  193, 32,
  2,   2,   127, 35,  0,   69,  4,   64,  65,  117, 15,  11,  35,  0,   65,
  1,   107, 36,  0,   32,  3,   11,  27,  34,  4,   67,  0,   0,   0,   0,
  32,  4,   32,  4,   91,  27,  11,  32,  3,   16,  1,   3,   127, 35,  0,
  69,  4,   64,  65,  168, 186, 126, 15,  11,  35,  0,   65,  1,   107, 36,
  0,   35,  0,   69,  4,   64,  65,  128, 1,   15,  11,  35,  0,   65,  1,
  107, 36,  0,   65,  255, 0,   32,  3,   69,  13,  2,   34,  3,   13,  0,
  32,  3,   11,  69,  13,  1,   32,  3,   69,  13,  1,   65,  220, 188, 126,
  13,  1,   34,  3,   4,   64,  2,   64,  2,   127, 35,  0,   69,  4,   64,
  65,  128, 128, 128, 128, 120, 15,  11,  35,  0,   65,  1,   107, 36,  0,
  32,  3,   32,  3,   13,  0,   13,  3,   35,  0,   69,  4,   64,  32,  3,
  15,  11,  35,  0,   65,  1,   107, 36,  0,   12,  1,   11,  26,  3,   127,
  35,  0,   69,  4,   64,  32,  3,   15,  11,  35,  0,   65,  1,   107, 36,
  0,   32,  3,   13,  0,   65,  1,   11,  26,  12,  2,   11,  35,  0,   69,
  4,   64,  65,  167, 127, 15,  11,  35,  0,   65,  1,   107, 36,  0,   35,
  0,   69,  4,   64,  65,  128, 192, 0,   15,  11,  35,  0,   65,  1,   107,
  36,  0,   35,  0,   69,  4,   64,  32,  3,   15,  11,  35,  0,   65,  1,
  107, 36,  0,   65,  147, 127, 12,  2,   5,   35,  0,   69,  4,   64,  65,
  129, 128, 128, 128, 120, 15,  11,  35,  0,   65,  1,   107, 36,  0,   11,
  11,  65,  255, 255, 125, 11,  11,  33,  0,   66,  252, 130, 221, 255, 15,
  66,  255, 255, 255, 255, 255, 255, 255, 255, 255, 0,   67,  0,   0,   234,
  66,  65,  252, 224, 168, 179, 122, 16,  1,   26,  11,  178, 2,   1,   2,
  127, 35,  0,   69,  4,   64,  65,  120, 15,  11,  35,  0,   65,  1,   107,
  36,  0,   2,   127, 35,  0,   69,  4,   64,  65,  0,   15,  11,  35,  0,
  65,  1,   107, 36,  0,   2,   127, 35,  0,   69,  4,   64,  65,  0,   15,
  11,  35,  0,   65,  1,   107, 36,  0,   65,  128, 8,   11,  4,   127, 65,
  0,   5,   2,   127, 65,  0,   65,  129, 126, 69,  13,  2,   4,   64,  3,
  64,  35,  0,   69,  4,   64,  65,  159, 216, 137, 124, 15,  11,  35,  0,
  65,  1,   107, 36,  0,   65,  0,   40,  2,   3,   26,  35,  0,   69,  4,
  64,  65,  222, 136, 126, 15,  11,  35,  0,   65,  1,   107, 36,  0,   3,
  64,  35,  0,   4,   64,  35,  0,   65,  1,   107, 36,  0,   12,  1,   5,
  65,  128, 8,   15,  11,  0,   11,  0,   11,  0,   5,   3,   64,  35,  0,
  69,  4,   64,  65,  0,   15,  11,  35,  0,   65,  1,   107, 36,  0,   2,
  127, 35,  0,   69,  4,   64,  65,  0,   15,  11,  35,  0,   65,  1,   107,
  36,  0,   65,  0,   2,   127, 35,  0,   69,  4,   64,  65,  0,   15,  11,
  35,  0,   65,  1,   107, 36,  0,   3,   64,  35,  0,   69,  4,   64,  65,
  0,   15,  11,  35,  0,   65,  1,   107, 36,  0,   11,  65,  1,   254, 18,
  0,   22,  11,  69,  13,  0,   11,  13,  0,   35,  0,   69,  4,   64,  65,
  128, 124, 15,  11,  35,  0,   65,  1,   107, 36,  0,   3,   64,  35,  0,
  69,  4,   64,  65,  224, 216, 2,   15,  11,  35,  0,   65,  1,   107, 36,
  0,   35,  0,   69,  4,   64,  65,  128, 128, 2,   15,  11,  35,  0,   65,
  1,   107, 36,  0,   65,  190, 127, 12,  3,   11,  0,   11,  0,   11,  0,
  11,  11,  11,  11,  23,  0,   35,  0,   69,  4,   64,  32,  4,   15,  11,
  35,  0,   65,  1,   107, 36,  0,   65,  0,   43,  3,   2,   11,  116, 0,
  65,  141, 176, 126, 66,  217, 236, 126, 66,  128, 1,   67,  0,   0,   0,
  79,  68,  0,   0,   0,   0,   0,   0,   80,  64,  65,  76,  67,  0,   0,
  128, 95,  16,  4,   26,  65,  32,  66,  129, 128, 128, 128, 120, 66,  230,
  212, 156, 252, 15,  67,  0,   0,   160, 64,  68,  0,   0,   0,   0,   0,
  0,   224, 67,  65,  127, 67,  0,   0,   128, 128, 16,  4,   26,  65,  255,
  166, 200, 177, 123, 66,  185, 127, 66,  128, 128, 128, 128, 8,   67,  0,
  0,   0,   93,  68,  0,   0,   0,   0,   0,   0,   96,  67,  65,  150, 224,
  126, 67,  0,   0,   0,   88,  16,  4,   26,  11,  111, 0,   35,  0,   69,
  4,   64,  65,  144, 194, 0,   15,  11,  35,  0,   65,  1,   107, 36,  0,
  3,   64,  35,  0,   69,  4,   64,  65,  0,   15,  11,  35,  0,   65,  1,
  107, 36,  0,   3,   64,  35,  0,   69,  4,   64,  65,  124, 15,  11,  35,
  0,   65,  1,   107, 36,  0,   35,  0,   69,  4,   64,  65,  111, 15,  11,
  35,  0,   65,  1,   107, 36,  0,   3,   127, 35,  0,   69,  4,   64,  65,
  128, 128, 2,   15,  11,  35,  0,   65,  1,   107, 36,  0,   65,  128, 128,
  126, 11,  69,  13,  0,   12,  1,   11,  0,   69,  0,   13,  0,   0,   11,
  0,   11,  14,  0,   16,  6,   26,  16,  6,   26,  16,  6,   26,  16,  6,
  26,  11,  34,  0,   35,  0,   69,  4,   64,  68,  0,   0,   0,   0,   0,
  0,   224, 67,  15,  11,  35,  0,   65,  1,   107, 36,  0,   68,  26,  192,
  255, 255, 255, 255, 255, 255, 11,  5,   0,   16,  8,   26,  11,  26,  0,
  35,  0,   69,  4,   64,  67,  0,   0,   0,   0,   15,  11,  35,  0,   65,
  1,   107, 36,  0,   67,  0,   0,   128, 214, 11,  26,  0,   35,  0,   69,
  4,   64,  67,  0,   0,   0,   90,  15,  11,  35,  0,   65,  1,   107, 36,
  0,   67,  0,   0,   44,  194, 11,  8,   0,   16,  11,  26,  16,  11,  26,
  11,  26,  0,   35,  0,   69,  4,   64,  67,  0,   0,   0,   197, 15,  11,
  35,  0,   65,  1,   107, 36,  0,   67,  117, 227, 255, 255, 11,  38,  0,
  68,  129, 255, 255, 255, 255, 255, 255, 255, 16,  13,  26,  68,  0,   0,
  0,   0,   0,   0,   16,  65,  16,  13,  26,  68,  193, 255, 255, 255, 255,
  255, 255, 255, 16,  13,  26,  11,  30,  0,   35,  0,   69,  4,   64,  15,
  11,  35,  0,   65,  1,   107, 36,  0,   35,  0,   69,  4,   64,  15,  11,
  35,  0,   65,  1,   107, 36,  0,   11,  6,   0,   16,  15,  16,  15,  11,
  16,  0,   35,  0,   69,  4,   64,  15,  11,  35,  0,   65,  1,   107, 36,
  0,   11,  8,   0,   16,  17,  16,  17,  16,  17,  11,  52,  0,   35,  0,
  69,  4,   64,  68,  0,   0,   0,   0,   0,   0,   0,   0,   15,  11,  35,
  0,   65,  1,   107, 36,  0,   3,   124, 35,  0,   4,   124, 35,  0,   65,
  1,   107, 36,  0,   12,  1,   5,   68,  0,   0,   0,   0,   0,   128, 109,
  64,  11,  11,  11,  218, 7,   3,   4,   127, 1,   126, 2,   125, 35,  0,
  69,  4,   64,  68,  255, 255, 255, 255, 255, 255, 239, 255, 15,  11,  35,
  0,   65,  1,   107, 36,  0,   2,   124, 3,   64,  35,  0,   69,  4,   64,
  68,  0,   0,   0,   0,   0,   0,   42,  192, 15,  11,  35,  0,   65,  1,
  107, 36,  0,   2,   64,  3,   64,  35,  0,   69,  4,   64,  68,  0,   0,
  0,   0,   0,   0,   176, 64,  15,  11,  35,  0,   65,  1,   107, 36,  0,
  65,  128, 127, 34,  2,   4,   127, 32,  0,   5,   35,  0,   69,  4,   64,
  68,  0,   0,   192, 137, 207, 250, 239, 65,  15,  11,  35,  0,   65,  1,
  107, 36,  0,   3,   64,  35,  0,   69,  4,   64,  68,  0,   0,   0,   245,
  255, 255, 239, 65,  15,  11,  35,  0,   65,  1,   107, 36,  0,   65,  134,
  82,  34,  0,   33,  3,   32,  1,   69,  13,  0,   11,  35,  0,   69,  4,
  64,  68,  0,   0,   0,   0,   0,   0,   144, 192, 15,  11,  35,  0,   65,
  1,   107, 36,  0,   32,  1,   69,  13,  2,   32,  4,   16,  3,   13,  1,
  65,  116, 33,  0,   12,  3,   11,  33,  2,   3,   127, 35,  0,   69,  4,
  64,  68,  77,  69,  29,  145, 255, 255, 255, 255, 15,  11,  35,  0,   65,
  1,   107, 36,  0,   32,  1,   13,  0,   32,  2,   34,  0,   34,  1,   11,
  13,  0,   11,  3,   64,  35,  0,   69,  4,   64,  68,  0,   0,   0,   0,
  0,   0,   48,  64,  15,  11,  35,  0,   65,  1,   107, 36,  0,   35,  0,
  69,  4,   64,  68,  0,   0,   0,   0,   0,   160, 102, 64,  15,  11,  35,
  0,   65,  1,   107, 36,  0,   32,  1,   33,  2,   65,  7,   17,  0,   0,
  3,   127, 35,  0,   69,  4,   64,  68,  0,   0,   0,   0,   0,   0,   240,
  63,  15,  11,  35,  0,   65,  1,   107, 36,  0,   2,   127, 35,  0,   69,
  4,   64,  68,  0,   0,   0,   0,   0,   128, 78,  192, 15,  11,  35,  0,
  65,  1,   107, 36,  0,   66,  129, 128, 128, 128, 120, 66,  128, 128, 2,
  32,  0,   27,  33,  4,   65,  177, 152, 126, 11,  4,   64,  3,   64,  35,
  0,   69,  4,   64,  68,  0,   0,   0,   0,   0,   0,   16,  195, 15,  11,
  35,  0,   65,  1,   107, 36,  0,   16,  6,   65,  15,  113, 65,  130, 128,
  126, 254, 0,   2,   0,   4,   64,  32,  0,   32,  1,   32,  2,   27,  4,
  127, 65,  207, 230, 157, 153, 4,   34,  0,   5,   65,  140, 226, 132, 187,
  6,   11,  26,  5,   67,  151, 255, 255, 255, 33,  6,   11,  32,  2,   13,
  0,   66,  128, 128, 128, 128, 128, 1,   33,  4,   11,  11,  3,   64,  35,
  0,   69,  4,   64,  68,  0,   0,   0,   0,   32,  250, 239, 64,  15,  11,
  35,  0,   65,  1,   107, 36,  0,   32,  6,   26,  3,   127, 35,  0,   69,
  4,   64,  68,  0,   0,   0,   0,   0,   0,   128, 67,  15,  11,  35,  0,
  65,  1,   107, 36,  0,   3,   127, 35,  0,   69,  4,   64,  68,  0,   0,
  0,   0,   0,   0,   77,  64,  15,  11,  35,  0,   65,  1,   107, 36,  0,
  67,  80,  255, 55,  202, 33,  6,   32,  2,   69,  13,  0,   65,  110, 11,
  34,  3,   13,  4,   32,  2,   33,  0,   32,  3,   69,  13,  0,   65,  128,
  96,  11,  69,  13,  0,   32,  1,   4,   127, 2,   127, 35,  0,   69,  4,
  64,  68,  138, 255, 255, 255, 255, 255, 255, 255, 15,  11,  35,  0,   65,
  1,   107, 36,  0,   35,  0,   69,  4,   64,  68,  215, 255, 255, 255, 255,
  255, 255, 255, 15,  11,  35,  0,   65,  1,   107, 36,  0,   65,  185, 127,
  2,   127, 35,  0,   69,  4,   64,  68,  0,   0,   0,   0,   0,   0,   224,
  195, 15,  11,  35,  0,   65,  1,   107, 36,  0,   65,  0,   11,  13,  0,
  4,   64,  68,  0,   0,   0,   0,   0,   0,   240, 66,  32,  3,   65,  4,
  17,  3,   0,   26,  5,   32,  1,   69,  13,  3,   11,  32,  2,   34,  1,
  11,  5,   65,  129, 1,   34,  1,   34,  0,   11,  69,  13,  2,   11,  32,
  1,   65,  15,  113, 65,  128, 128, 32,  34,  1,   254, 0,   2,   0,   69,
  13,  0,   65,  128, 128, 32,  65,  129, 128, 124, 32,  0,   27,  11,  34,
  0,   13,  0,   65,  4,   66,  217, 208, 176, 127, 254, 24,  3,   0,   12,
  0,   11,  0,   11,  3,   127, 35,  0,   69,  4,   64,  68,  0,   0,   0,
  0,   0,   128, 84,  64,  15,  11,  35,  0,   65,  1,   107, 36,  0,   35,
  0,   69,  4,   64,  68,  177, 255, 255, 255, 255, 255, 255, 255, 15,  11,
  35,  0,   65,  1,   107, 36,  0,   32,  2,   13,  0,   35,  0,   69,  4,
  64,  68,  0,   0,   0,   0,   0,   0,   64,  195, 15,  11,  35,  0,   65,
  1,   107, 36,  0,   32,  0,   69,  13,  0,   35,  0,   69,  4,   64,  68,
  0,   0,   0,   0,   0,   0,   96,  64,  15,  11,  35,  0,   65,  1,   107,
  36,  0,   3,   124, 35,  0,   69,  4,   64,  68,  0,   0,   0,   0,   0,
  0,   16,  184, 15,  11,  35,  0,   65,  1,   107, 36,  0,   32,  3,   13,
  0,   68,  0,   0,   0,   0,   0,   0,   224, 195, 11,  32,  0,   13,  2,
  26,  35,  0,   69,  4,   64,  68,  0,   0,   0,   0,   0,   0,   192, 66,
  15,  11,  35,  0,   65,  1,   107, 36,  0,   32,  1,   13,  0,   35,  0,
  69,  4,   64,  68,  0,   0,   0,   0,   0,   0,   240, 191, 15,  11,  35,
  0,   65,  1,   107, 36,  0,   65,  128, 126, 11,  13,  0,   11,  35,  0,
  69,  4,   64,  68,  136, 255, 255, 255, 255, 255, 255, 255, 15,  11,  35,
  0,   65,  1,   107, 36,  0,   68,  0,   0,   0,   0,   0,   0,   0,   192,
  11,  11,  6,   0,   65,  10,  36,  0,   11,  11,  15,  1,   0,   65,  0,
  11,  9,   109, 0,   0,   0,   0,   0,   0,   0,   38
]));

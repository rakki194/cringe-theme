const digitLookup = new Uint8Array(128);
for (let i = 0; i < 83; i++) {
    digitLookup[
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~'.charCodeAt(
            i,
        )
    ] = i;
}
const decode83 = (str, start, end) => {
    let value = 0;
    while (start < end) {
        value *= 83;
        value += digitLookup[str.charCodeAt(start++)];
    }
    return value;
};

const pow = Math.pow;
const PI = Math.PI;
const PI2 = PI * 2;

const d = 3294.6;
const e = 269.025;
const sRGBToLinear = (value) =>
    value > 10.31475 ? pow(value / e + 0.052132, 2.4) : value / d;

const linearTosRGB = (v) =>
    ~~(v > 0.00001227 ? e * pow(v, 0.416666) - 13.025 : v * d + 1);

const signSqr = (x) => (x < 0 ? -1 : 1) * x * x;

/**
 * Fast approximate cosine implementation
 * Based on FTrig https://github.com/netcell/FTrig
 */
const fastCos = (x) => {
    x += PI / 2;
    while (x > PI) {
        x -= PI2;
    }
    const cos = 1.27323954 * x - 0.405284735 * signSqr(x);
    return 0.225 * (signSqr(cos) - cos) + cos;
};

/**
 * Extracts average color from BlurHash image
 * @param {string} blurHash BlurHash image string
 * @returns {[number, number, number]}
 */
export function getBlurHashAverageColor(blurHash) {
    const val = decode83(blurHash, 2, 6);
    return [val >> 16, (val >> 8) & 255, val & 255];
}

/**
 * Decodes BlurHash image
 * @param {string} blurHash BlurHash image string
 * @param {number} width Output image width
 * @param {number} height Output image height
 * @param {?number} punch
 * @returns {Uint8ClampedArray}
 */
export function decodeBlurHash(blurHash, width, height, punch) {
    const sizeFlag = decode83(blurHash, 0, 1);
    const numX = (sizeFlag % 9) + 1;
    const numY = ~~(sizeFlag / 9) + 1;
    const size = numX * numY;

    let i = 0,
        j = 0,
        x = 0,
        y = 0,
        r = 0,
        g = 0,
        b = 0,
        basis = 0,
        basisY = 0,
        colorIndex = 0,
        pixelIndex = 0,
        value = 0;

    const maximumValue = ((decode83(blurHash, 1, 2) + 1) / 13446) * (punch | 1);

    const colors = new Float64Array(size * 3);

    const averageColor = getBlurHashAverageColor(blurHash);
    for (i = 0; i < 3; i++) {
        colors[i] = sRGBToLinear(averageColor[i]);
    }

    for (i = 1; i < size; i++) {
        value = decode83(blurHash, 4 + i * 2, 6 + i * 2);
        colors[i * 3] = signSqr(~~(value / 361) - 9) * maximumValue;
        colors[i * 3 + 1] = signSqr((~~(value / 19) % 19) - 9) * maximumValue;
        colors[i * 3 + 2] = signSqr((value % 19) - 9) * maximumValue;
    }

    const cosinesY = new Float64Array(numY * height);
    const cosinesX = new Float64Array(numX * width);
    for (j = 0; j < numY; j++) {
        for (y = 0; y < height; y++) {
            cosinesY[j * height + y] = fastCos((PI * y * j) / height);
        }
    }
    for (i = 0; i < numX; i++) {
        for (x = 0; x < width; x++) {
            cosinesX[i * width + x] = fastCos((PI * x * i) / width);
        }
    }

    const bytesPerRow = width * 4;
    const pixels = new Uint8ClampedArray(bytesPerRow * height);

    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            r = g = b = 0;
            for (j = 0; j < numY; j++) {
                basisY = cosinesY[j * height + y];
                for (i = 0; i < numX; i++) {
                    basis = cosinesX[i * width + x] * basisY;
                    colorIndex = (i + j * numX) * 3;
                    r += colors[colorIndex] * basis;
                    g += colors[colorIndex + 1] * basis;
                    b += colors[colorIndex + 2] * basis;
                }
            }

            pixelIndex = 4 * x + y * bytesPerRow;
            pixels[pixelIndex] = linearTosRGB(r);
            pixels[pixelIndex + 1] = linearTosRGB(g);
            pixels[pixelIndex + 2] = linearTosRGB(b);
            pixels[pixelIndex + 3] = 255; // alpha
        }
    }
    return pixels;
}

function renderBlurHash(blurHash, canvas, width, height) {
    try {
        const pixels = decodeBlurHash(blurHash, width, height);
        const ctx = canvas.getContext('2d', { 
            alpha: true,
            willReadFrequently: true 
        });
        
        if (!ctx) {
            console.error('Could not get 2D context for blurhash canvas');
            return;
        }

        canvas.width = width;
        canvas.height = height;
        
        // Clear the canvas first
        ctx.clearRect(0, 0, width, height);
        
        const imageData = new ImageData(pixels, width, height);
        ctx.putImageData(imageData, 0, 0);
    } catch (error) {
        console.error('Error rendering blurhash:', error);
        // Apply a fallback background color
        const ctx = canvas.getContext('2d');
        if (ctx) {
            canvas.width = width;
            canvas.height = height;
            ctx.fillStyle = '#808080';
            ctx.fillRect(0, 0, width, height);
        }
    }
}

function initializeBlurHashCanvas(canvas) {
    try {
        const container = canvas.closest('.image-container');
        if (!container) {
            throw new Error('Canvas must be inside .image-container');
        }

        const blurHash = canvas.dataset.blurhash;
        if (!blurHash) {
            throw new Error('Missing blurhash data attribute');
        }

        const width = parseInt(container.dataset.width) || 400;
        const height = parseInt(container.dataset.height) || 300;
        
        // Set container dimensions
        container.style.maxWidth = width + 'px';
        container.style.aspectRatio = width + '/' + height;
        
        // Only set canvas dimensions if not already set
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }
        
        // Check if the associated image is already loaded
        const img = container.querySelector('img');
        if (img && img.complete && img.naturalWidth !== 0) {
            canvas.style.display = 'none';
            img.style.opacity = '1';
            return;
        }
        
        // Queue the blurhash rendering in the next frame if needed
        if (!canvas.hasAttribute('data-rendered')) {
            requestAnimationFrame(() => {
                renderBlurHash(blurHash, canvas, width, height);
                canvas.setAttribute('data-rendered', 'true');
            });
        }
    } catch (error) {
        console.error('Error initializing blurhash canvas:', error);
    }
}

// Process any existing blurhash canvases immediately
document.addEventListener('DOMContentLoaded', () => {
    const existingCanvases = document.querySelectorAll('canvas.blur-hash:not([data-rendered])');
    if (existingCanvases.length > 0) {
        existingCanvases.forEach(canvas => {
            try {
                const container = canvas.closest('.image-container');
                if (container) {
                    const width = parseInt(container.dataset.width) || 400;
                    const height = parseInt(container.dataset.height) || 300;
                    container.style.maxWidth = width + 'px';
                    container.style.aspectRatio = width + '/' + height;
                    
                    // Only set canvas dimensions if not already set
                    if (canvas.width !== width || canvas.height !== height) {
                        canvas.width = width;
                        canvas.height = height;
                    }
                }
            } catch (error) {
                console.error('Error setting initial canvas size:', error);
            }
        });
        
        // Process blurhash rendering in batches
        let index = 0;
        function processNextBatch() {
            const batchSize = 5;
            const batch = Array.from(existingCanvases).slice(index, index + batchSize);
            
            if (batch.length === 0) return;
            
            batch.forEach(initializeBlurHashCanvas);
            index += batchSize;
            
            if (index < existingCanvases.length) {
                requestAnimationFrame(processNextBatch);
            }
        }
        
        processNextBatch();
    }
});

// Watch for new blurhash canvases being added
const observer = new MutationObserver((mutations) => {
    const newCanvases = new Set();
    
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                // Check if the added node is a blurhash canvas
                if (node.matches('canvas.blur-hash:not([data-rendered])')) {
                    newCanvases.add(node);
                }
                // Check for blurhash canvases within the added node
                node.querySelectorAll('canvas.blur-hash:not([data-rendered])').forEach(canvas => {
                    newCanvases.add(canvas);
                });
            }
        }
    }
    
    // Process new canvases in batches
    if (newCanvases.size > 0) {
        let canvases = Array.from(newCanvases);
        let index = 0;
        
        function processNextBatch() {
            const batchSize = 5;
            const batch = canvases.slice(index, index + batchSize);
            
            if (batch.length === 0) return;
            
            batch.forEach(initializeBlurHashCanvas);
            index += batchSize;
            
            if (index < canvases.length) {
                requestAnimationFrame(processNextBatch);
            }
        }
        
        processNextBatch();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
export interface Cords {
    x: number,
    y: number
}
export interface CordsPair {
    start: Cords,
    end: Cords
}

const INSIDE = 0 // 0000
const LEFT = 1 // 0001
const RIGHT = 2 // 0010
const BOTTOM = 4 // 0100
const TOP = 8	 // 1000

export class CohenSutherlandClip {

    constructor() {
    }

    isLineClippedOrContained(
        rect: CordsPair,
        line: CordsPair
    ): boolean {
        return this.cohenSutherlandClip(
            line.start.x,
            line.start.y,
            line.end.x,
            line.end.y,
            rect
        );
    }


    private computeCode(x, y, rect: CordsPair) {
        let	code = INSIDE;
        if (x < rect.start.x) {	 // to the left of rectangle
            code += LEFT;
        } else if (x > rect.end.x) { // to the right of rectangle
            code += RIGHT;
        }
        if (y < rect.start.y) {	 // below the rectangle
            code += BOTTOM;
        } else if (y > rect.end.y) { // above the rectangle
            code += TOP;
        }
        return code;
    }


// Defining region codes


// Defining rect.end.x, rect.end.y and rect.start.x, rect.start.y for rectangle
// Since diagonal points are enough to define a rectangle


// Function to compute region code for a point(x, y)


// Implementing Cohen-Sutherland algorithm
// Clipping a line from P1 = (x1, y1) to P2 = (x2, y2)
    private cohenSutherlandClip(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        rect: CordsPair) {

        // Compute region codes for P1, P2
        let code1 = this.computeCode(x1, y1, rect);
        let code2 = this.computeCode(x2, y2, rect);
        let accept = false;

        while (true) {

            // If both endpoints lie within rectangle
            if (code1 == 0 && code2 == 0) {
                accept = true;
                break;
                // If both endpoints are outside rectangle
            } else if ((code1 & code2) != 0) {
                break;
                // Some segment lies within the rectangle
            } else {

                // Line Needs clipping
                // At least one of the points is outside,
                // select it
                let code_out;
                let x = 1.0;
                let y = 1.0;
                if (code1 != 0) {
                    code_out = code1;
                } else {
                    code_out = code2;
                }
                // Find intersection point
                // using formulas y = y1 + slope * (x - x1),
                // x = x1 + (1 / slope) * (y - y1)
                if (code_out & TOP) {
                    // point is above the clip rectangle
                    x = x1 + (x2 - x1) * (rect.end.y - y1) / (y2 - y1);
                    y = rect.end.y;
                } else if (code_out & BOTTOM) {
                    // point is below the clip rectangle
                    x = x1 + (x2 - x1) * (rect.start.y - y1) / (y2 - y1);
                    y = rect.start.y;

                } else if (code_out & RIGHT) {
                    // point is to the right of the clip rectangle
                    y = y1 + (y2 - y1) * (rect.end.x - x1) / (x2 - x1);
                    x = rect.end.x;

                } else if (code_out & LEFT) {
                    // point is to the left of the clip rectangle
                    y = y1 + (y2 - y1) * (rect.start.x - x1) / (x2 - x1);
                    x = rect.start.x;
                }
                // Now intersection point x, y is found
                // We replace point outside clipping rectangle
                // by intersection point
                if (code_out == code1) {
                    x1 = x;
                    y1 = y;
                    code1 = this.computeCode(x1, y1, rect);
                } else {
                    x2 = x;
                    y2 = y;
                    code2 = this.computeCode(x2, y2, rect);
                }
            }
        }
        console.log( accept ? `Line accepted from ${x1}, ${y1} ,${x2} ,${y2}`: 'Line rejected');
        return accept;
    }
}


const a = new CohenSutherlandClip();
const box: CordsPair = {start: {x: 4, y: 4}, end: {x: 10, y: 8}};
console.log(a.isLineClippedOrContained(box, {start: {x: 5, y: 5}, end: {x: 7, y: 7}})); // true
console.log(a.isLineClippedOrContained(box, {start: {x: 7, y: 9}, end: {x: 11, y: 4}})); // true
console.log(a.isLineClippedOrContained(box, {start: {x: 1, y: 5}, end: {x: 4, y: 1}})); // false

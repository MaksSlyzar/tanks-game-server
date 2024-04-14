export interface Vector2d {
    x: number;
    y: number;
  }
  
  export function quadColliderMesh(width: number, height: number) {
    const polygon: Array<Vector2d> = [
      { x: -width / 2, y: -height / 2 },
      { x: -width / 2, y: height / 2 },
      { x: width / 2, y: height / 2 },
      { x: width / 2, y: -height / 2 },
    ];
    return polygon;
  }
  
  export function updateShape(
    posX: number,
    posY: number,
    angle: number,
    shape: Array<Vector2d>
  ) {
    const output = [...shape];
  
    for (let i = 0; i < output.length; i++) {
      output[i] = {
        x: output[i].x * Math.cos(angle) - output[i].y * Math.sin(angle) + posX,
        y: output[i].x * Math.sin(angle) + output[i].y * Math.cos(angle) + posY,
      };
    }
    return output;
  }
  
  export function satCollide(box1: Array<Vector2d>, box2: Array<Vector2d>) {
    let poly1 = box1;
    let poly2 = box2;
  
    if (poly1 == undefined) return;
  
    if (poly2 == undefined) return;
  
    for (let shape = 0; shape < 2; shape++) {
      if (shape == 1) {
        poly1 = box2;
        poly2 = box1;
      }
  
      for (let a = 0; a < poly1.length; a++) {
        let b = (a + 1) % poly1.length;
        let axisProj = {
          x: -(poly1[b].y - poly1[a].y),
          y: poly1[b].x - poly1[a].x,
        };
        let min_r1 = 999999,
          max_r1 = -999999;
  
        for (let p = 0; p < poly1.length; p++) {
          let q = poly1[p].x * axisProj.x + poly1[p].y * axisProj.y;
  
          min_r1 = Math.min(min_r1, q);
          max_r1 = Math.max(max_r1, q);
        }
  
        let min_r2 = 999999,
          max_r2 = -999999;
  
        for (let p = 0; p < poly2.length; p++) {
          let q = poly2[p].x * axisProj.x + poly2[p].y * axisProj.y;
  
          min_r2 = Math.min(min_r2, q);
          max_r2 = Math.max(max_r2, q);
        }
  
        if (!(max_r2 >= min_r1 && max_r1 >= min_r2)) return false;
      }
    }
  
    return true;
  }
  
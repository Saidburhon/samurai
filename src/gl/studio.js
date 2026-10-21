// The studio follows the camera between holds (§3.5): no chrome flash, no grey plastic.
// The studio is a rotation M applied to the reflection direction (uStudio), tuned per hold. Each hold k keeps
// M[k] (its tuned studio, in the sword's frame) and C[k] = M[k] · Rcam[k] (the same studio carried by its camera).
// Between holds the studio is interpolated in camera space, with a world share per transition (studioW):
//   Mcam   = slerp(C[k], C[k+1], e) · Rcam⁻¹      the studio carried by the moving camera
//   Mworld = slerp(M[k], M[k+1], e)               the studio fixed in the world
//   M      = slerp(Mcam, Mworld, studioW) · R(axis, −½ ambient roll)
// At every hold M = M[k] exactly, so the tuned frames stay tuned. G1 renders holds; G3's director calls this per frame.
import { Matrix4, Quaternion, Vector3 } from 'three';

const qa = new Quaternion(), qb = new Quaternion(), qc = new Quaternion();

// a hold's tuned studio: a roll about the blade axis and a yaw about the vertical (shots.js studioRoll, studioYaw)
export function holdStudio(roll = 0, yaw = 0) { return new Matrix4().makeRotationX(roll).multiply(new Matrix4().makeRotationY(yaw)); }

// C[k] for a hold: the studio carried by that hold's camera (Rcam = the camera's rotation, camera -> world)
export function carried(M, camera) { return M.clone().multiply(new Matrix4().extractRotation(camera.matrixWorld)); }

const slerpM = (A, B, t, out) => { qa.setFromRotationMatrix(A); qb.setFromRotationMatrix(B); qc.slerpQuaternions(qa, qb, t); return out.makeRotationFromQuaternion(qc); };

export function studioBetween({ Mk, Mk1, Ck, Ck1, camera, e, studioW = 0.3, ambientRoll = 0, bladeAxis = new Vector3(1, 0, 0) }) {
  const Rinv = new Matrix4().extractRotation(camera.matrixWorld).invert();
  const Mcam = slerpM(Ck, Ck1, e, new Matrix4()).multiply(Rinv);
  const Mworld = slerpM(Mk, Mk1, e, new Matrix4());
  const M = slerpM(Mcam, Mworld, studioW, new Matrix4());
  if (ambientRoll) M.multiply(new Matrix4().makeRotationAxis(bladeAxis, -0.5 * ambientRoll));
  return M;
}

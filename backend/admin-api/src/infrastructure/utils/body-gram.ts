export const BodyMeasurementDTO: BodyMeasurementDto = {
  "scan_id": "", // Will be set dynamically
  "bodyComposition": {
    "bodyFatPercentage": null,
    "skeletalMuscleMass": null
  },
  "customScanId": "",
  "input": {
    "photoScan": {
      "age": null,
      "frontPhoto": null,
      "gender": null,
      "height": null,
      "rightPhoto": null,
      "weight": null
    }
  },
  "measurements": [
    { "name": "acrossBackShoulderWidth", "unit": "mm", "value": null },
    { "name": "backNeckHeight", "unit": "mm", "value": null },
    { "name": "backNeckPointToGroundContoured", "unit": "mm", "value": null },
    { "name": "backNeckPointToWaist", "unit": "mm", "value": null },
    { "name": "backNeckPointToWristLengthR", "unit": "mm", "value": null },
    { "name": "bellyWaistDepth", "unit": "mm", "value": null },
    { "name": "bellyWaistGirth", "unit": "mm", "value": null },
    { "name": "bellyWaistHeight", "unit": "mm", "value": null },
    { "name": "bellyWaistWidth", "unit": "mm", "value": null },
    { "name": "bustGirth", "unit": "mm", "value": null },
    { "name": "bustHeight", "unit": "mm", "value": null },
    { "name": "calfGirthR", "unit": "mm", "value": null },
    { "name": "forearmGirthR", "unit": "mm", "value": null },
    { "name": "hipGirth", "unit": "mm", "value": null },
    { "name": "hipHeight", "unit": "mm", "value": null },
    { "name": "insideLegHeight", "unit": "mm", "value": null },
    { "name": "insideLegLengthR", "unit": "mm", "value": null },
    { "name": "kneeGirthR", "unit": "mm", "value": null },
    { "name": "kneeHeightR", "unit": "mm", "value": null },
    { "name": "midThighGirthR", "unit": "mm", "value": null },
    { "name": "neckBaseGirth", "unit": "mm", "value": null },
    { "name": "neckGirth", "unit": "mm", "value": null },
    { "name": "outerAnkleHeightR", "unit": "mm", "value": null },
    { "name": "outerArmLengthR", "unit": "mm", "value": null },
    { "name": "outseamR", "unit": "mm", "value": null },
    { "name": "outsideLegLengthR", "unit": "mm", "value": null },
    { "name": "shoulderToElbowR", "unit": "mm", "value": null },
    { "name": "thighGirthR", "unit": "mm", "value": null },
    { "name": "topHipGirth", "unit": "mm", "value": null },
    { "name": "topHipHeight", "unit": "mm", "value": null },
    { "name": "underBustGirth", "unit": "mm", "value": null },
    { "name": "upperArmGirthR", "unit": "mm", "value": null },
    { "name": "waistGirth", "unit": "mm", "value": null },
    { "name": "waistHeight", "unit": "mm", "value": null },
    { "name": "wristGirthR", "unit": "mm", "value": null }
  ],
  "memberId": "", // Will be set dynamically
  "posture": null
};

// dto/body-measurement.interface.ts
export interface MeasurementEntry {
  name: string;
  unit: string;
  value: number | null;
}

export interface PhotoScanData {
  age: number | null;
  frontPhoto: string | null;
  gender: string | null;
  height: number | null;
  rightPhoto: string | null;
  weight: number | null;
}

export interface BodyCompositionData {
  bodyFatPercentage: number | null;
  skeletalMuscleMass: number | null;
}

export interface InputData {
  photoScan: PhotoScanData;
}

export interface PostureData {
  front: {
    angles: Array<{
      name: string;
      unit: string;
      value: number | null;
    }>;
    lines: Array<{
      name: string;
      points: Array<{
        x: number | null;
        y: number | null;
      }>;
    }>;
  };
  right: {
    angles: Array<{
      name: string;
      unit: string;
      angles: number[] | null;
    }>;
    lines: Array<{
      name: string;
      points: Array<{
        x: number | null;
        y: number | null;
      }>;
    }>;
  };
}

export interface BodyMeasurementDto {
  
  // Database column: scan_id -> scanId
  scan_id: string;
  
  // Database column: body_composition -> bodyComposition (JSON)
  bodyComposition: BodyCompositionData;
  
  // Database column: custom_scan_id -> customScanId
  customScanId: string;
  
  // Database column: input (JSON)
  input: InputData;
  
  // Database column: measurements (JSON Array)
  measurements: MeasurementEntry[];
  
  // Database column: member_id -> memberId
  memberId: string;
  
  // Database column: posture (JSON)
  posture: PostureData | null;
  
  // Auto-generated timestamp columns
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
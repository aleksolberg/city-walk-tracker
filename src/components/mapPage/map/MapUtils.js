export function computeDistance(lat1, lng1, lat2, lng2) {
    const latConversion = 111132.92;
    const lngConversion = 111412.84; 

    const x = (lat2 - lat1) * latConversion;
    const y = (lng2 - lng1) * lngConversion * Math.cos((lat1 + lat2) * 0.00872664626);  // 0.00872664626 is pi/360 

    return Math.sqrt(x*x + y*y);
}

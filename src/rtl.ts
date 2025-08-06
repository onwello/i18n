// RTL utilities - separate entry point for tree shaking
export { 
  isRTL, 
  getRTLInfo, 
  getRTLLocales, 
  getRTLLocalesInfo, 
  containsRTLText, 
  getTextDirection, 
  wrapWithDirectionalMarkers, 
  cleanDirectionalMarkers,
  clearRTLCaches
} from './utils/rtl.utils'; 
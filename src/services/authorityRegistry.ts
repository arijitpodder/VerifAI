import type { AuthorityCheckResult, AuthorityRecordStatus } from '../types';

/**
 * Simulates a government identity registry / INTERPOL SLTD query
 */
export async function queryAuthorityRegistry(
  docNumber: string,
  docType: string,
  holderName: string,
  presetStatus?: AuthorityRecordStatus,
  presetInterpol?: boolean,
  presetNotes?: string
): Promise<AuthorityCheckResult> {
  const startTime = performance.now();

  // Simulated latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  const queryLatencyMs = Math.round(performance.now() - startTime);
  const ledgerTxHash = '0x' + Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');

  // If preset is explicitly provided (for demo scenarios)
  if (presetStatus) {
    let score = 98;
    let queryStatus: AuthorityCheckResult['queryStatus'] = 'MATCH_FOUND';

    if (presetStatus === 'STOLEN' || presetInterpol) {
      score = 0;
      queryStatus = 'FLAGGED_STOLEN';
    } else if (presetStatus === 'REVOKED') {
      score = 15;
      queryStatus = 'FLAGGED_REVOKED';
    } else if (presetStatus === 'EXPIRED') {
      score = 35;
      queryStatus = 'MATCH_FOUND';
    } else if (presetStatus === 'NOT_FOUND') {
      score = 25;
      queryStatus = 'NOT_FOUND';
    }

    return {
      queryStatus,
      registryName: getRegistryNameForDocType(docType),
      recordId: `REG-${docNumber.replace(/[^A-Za-z0-9]/g, '')}`,
      issuedTo: holderName,
      activeStatus: presetStatus,
      interpolStolenRecord: !!presetInterpol,
      issuanceTimestamp: '2021-04-14T09:30:00Z',
      queryLatencyMs,
      ledgerTxHash,
      score,
      notes: presetNotes || 'Official registry ledger query completed.',
      databaseJurisdiction: 'Global Trust PKI / National Border Authority'
    };
  }

  // Default fallback for custom user uploads
  return {
    queryStatus: 'MATCH_FOUND',
    registryName: getRegistryNameForDocType(docType),
    recordId: `REG-${docNumber.replace(/[^A-Za-z0-9]/g, '')}`,
    issuedTo: holderName,
    activeStatus: 'ACTIVE',
    interpolStolenRecord: false,
    issuanceTimestamp: new Date().toISOString(),
    queryLatencyMs,
    ledgerTxHash,
    score: 95,
    notes: 'Document registered in active status. No revocation or theft reports.',
    databaseJurisdiction: 'National Civil Registry & INTERPOL SLTD Gateway'
  };
}

function getRegistryNameForDocType(docType: string): string {
  switch (docType) {
    case 'PASSPORT':
      return 'ICAO PKD & INTERPOL SLTD Global Gateway';
    case 'DRIVERS_LICENSE':
      return 'AAMVA Commercial Driver License Network (CDLIS)';
    case 'NATIONAL_ID':
    default:
      return 'National Civil Registry & Digital ID Infrastructure (eIDAS)';
  }
}

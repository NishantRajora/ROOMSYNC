import React, { useState } from 'react';
import { registerHash, verifyHash, Record } from './blockchain';

interface Props {
  api: string;
  onNotify: (msg: string) => void;
}

interface AnalysisResult {
  hash: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  clauses: Array<{
    type: string;
    text: string;
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;
}

export const AgreementVerifier: React.FC<Props> = ({ api, onNotify }) => {
  const [agreementText, setAgreementText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<Record | null | undefined>(undefined); // undefined = not checked, null = checked & not found

  const baseApi = api.replace(/\/api\/?$/, "") + "/api";

  const handleAnalyse = async () => {
    if (!agreementText.trim()) {
      onNotify('Please enter some agreement text to analyse.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${baseApi}/agreements/analyse/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: agreementText }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      const hash = data.sha256 || data.hash || '';
      const rawRisk = (data.overall_risk || data.riskLevel || 'low').toUpperCase();
      const riskLevel = (['LOW', 'MEDIUM', 'HIGH'].includes(rawRisk) ? rawRisk : 'MEDIUM') as 'LOW' | 'MEDIUM' | 'HIGH';
      const clauses = (data.clauses || []).map((c: any) => ({
        type: c.type || c.clause || 'Clause',
        text: c.clause_text || c.text || c.explanation || '',
        risk: ((c.risk_level || c.risk || 'low').toUpperCase()) as 'LOW' | 'MEDIUM' | 'HIGH'
      }));
      setAnalysis({ hash, riskLevel, clauses });
      setVerificationResult(undefined);
      onNotify('Analysis completed successfully.');
    } catch (error) {
      onNotify('Failed to analyze the agreement.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!analysis?.hash) return;

    setIsRegistering(true);
    try {
      onNotify('Initiating transaction. Please confirm in your wallet...');
      const receipt = await registerHash(analysis.hash);
      if (receipt) {
        onNotify('Successfully registered agreement on-chain!');
        // Automatically verify after successful registration
        await handleVerify();
      }
    } catch (error: any) {
      console.error(error);
      onNotify(`Registration failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleVerify = async () => {
    if (!analysis?.hash) return;

    setIsVerifying(true);
    try {
      const record = await verifyHash(analysis.hash);
      setVerificationResult(record);
      if (record) {
        onNotify('Agreement found on the blockchain.');
      } else {
        onNotify('Agreement not found on the blockchain.');
      }
    } catch (error: any) {
      console.error(error);
      onNotify(`Verification failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'green';
      case 'MEDIUM': return 'orange';
      case 'HIGH': return 'red';
      default: return 'black';
    }
  };

  return (
    <section className="agreement-section">
      <p className="eyebrow mint-text">SMART LEGAL SHIELD & BLOCKCHAIN REGISTRY</p>
      <h2>Rental Agreement Verification</h2>
      <p>
        Analyse rental clauses against model tenancy rules, calculate SHA-256 document fingerprints,
        and anchor or verify agreement integrity on Ethereum / Polygon smart contracts.
      </p>

      <div className="agreement-grid">
        <div className="agreement-input-panel">
          <h3>Agreement Text</h3>
          <textarea
            placeholder="Paste your rental agreement text here (e.g. security deposit, notice period, landlord entry clauses)..."
            value={agreementText}
            onChange={(e) => setAgreementText(e.target.value)}
            disabled={isLoading || isRegistering || isVerifying}
          />
          <div className="agreement-actions">
            <button className="primary" onClick={handleAnalyse} disabled={isLoading || isRegistering || isVerifying}>
              {isLoading ? 'Analysing Clauses...' : 'Analyse Agreement'}
            </button>
            {analysis?.hash && (
              <>
                <button onClick={handleRegister} disabled={isRegistering || isVerifying}>
                  {isRegistering ? 'Registering...' : 'Anchor on Blockchain'}
                </button>
                <button onClick={handleVerify} disabled={isRegistering || isVerifying}>
                  {isVerifying ? 'Verifying...' : 'Verify on Chain'}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="agreement-result-panel">
          <h3>Verification & Clause Analysis</h3>
          {analysis ? (
            <div>
              <div>
                <strong>SHA-256 Cryptographic Hash</strong>
                <div className="agreement-hash">{analysis.hash}</div>
              </div>
              <div style={{ margin: '12px 0' }}>
                <strong>Risk Assessment: </strong>
                <span className={`agreement-risk-badge ${analysis.riskLevel.toLowerCase()}`}>
                  {analysis.riskLevel} Risk
                </span>
              </div>

              <div style={{ marginTop: '16px' }}>
                <strong>Detected Clauses ({analysis.clauses.length})</strong>
                {analysis.clauses.length > 0 ? (
                  analysis.clauses.map((clause, idx) => (
                    <div key={idx} className={`agreement-clause ${clause.risk.toLowerCase()}`}>
                      <strong>{clause.type}</strong>
                      <p>"{clause.text}"</p>
                      <small>Risk: {clause.risk}</small>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--muted)', marginTop: '8px' }}>
                    No risky clauses detected. Standard baseline terms.
                  </p>
                )}
              </div>

              {verificationResult !== undefined && (
                <div className={`agreement-chain-status ${verificationResult ? 'success' : 'error'}`}>
                  {verificationResult ? (
                    <div>
                      <strong>✅ Verified on Blockchain</strong>
                      <div>Registrant: {verificationResult.registrant}</div>
                      <div>Timestamp: {new Date(verificationResult.timestamp * 1000).toLocaleString()}</div>
                    </div>
                  ) : (
                    <div>
                      <strong>❌ Not Found on Blockchain</strong>
                      <div>This agreement hash has not been anchored to the smart contract registry yet.</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--muted)', marginTop: '20px' }}>
              Paste agreement text on the left and click "Analyse Agreement" to inspect risks and verify on-chain integrity.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

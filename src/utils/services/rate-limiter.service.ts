import { Logger } from '@nestjs/common';

type AnyFunction = <T>(...args: unknown[]) => T;

export class OutboundRateLimiter {
  private _rateLimit: number;
  private _availableToken: number;
  private _tokenIntervalMs: number;

  public constructor(rateLimit: number, limitDurationInSec: number) {
    this._rateLimit = rateLimit;
    this._availableToken = rateLimit;
    this._tokenIntervalMs = 1000 * limitDurationInSec;
  }

  private refillBucket(): void {
    if (this._availableToken === 0) {
      this._availableToken = this._rateLimit;
      Logger.log('========= tokens added to bucket');
      Logger.log(`====== ${this._availableToken}`);
    }
  }

  /** delay execution for a period of time */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** gets token to perform an action */
  public async getToken<T>(func: AnyFunction): Promise<T> {
    if (this._availableToken === 0) {
      await this.sleep(this._tokenIntervalMs);
      this.refillBucket();
    }

    const result = await (<T>func());
    this._availableToken--;
    return result;
  }
}

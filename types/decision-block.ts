/**
 * DSS Framework — Decision Block public contract.
 *
 * This is the Composition → Decision Block structured-input contract.
 * Rendering remains a Presentation responsibility.
 */

import type { BlockConfiguration } from "./composition";
import type { BlockReference } from "./primitives";

export interface DecisionBlockContract<
  TRequiredInput extends Readonly<Record<string, unknown>> = Readonly<
    Record<string, unknown>
  >,
  TOptionalInput extends Readonly<Record<string, unknown>> = Readonly<
    Record<string, unknown>
  >,
> {
  readonly blockReference: BlockReference;
  readonly requiredInput: TRequiredInput;
  readonly optionalInput?: TOptionalInput;
  readonly outputExpectations: string;
  readonly validationRequirements: readonly string[];
}

export interface DecisionBlockDefinition<
  TRequiredInput extends Readonly<Record<string, unknown>> = Readonly<
    Record<string, unknown>
  >,
  TOptionalInput extends Readonly<Record<string, unknown>> = Readonly<
    Record<string, unknown>
  >,
> {
  readonly contract: DecisionBlockContract<TRequiredInput, TOptionalInput>;
}

export type DecisionBlockInput = BlockConfiguration;


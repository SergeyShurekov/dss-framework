/**
 * DSS Framework — primitive structural contracts.
 *
 * Primitive types carry generic value semantics only. They do not own
 * framework/domain meaning.
 */

export type Identifier = string;

export type Version = string;

export type Status = string;

export type Locale = string;

export type URL = string;

export type Timestamp = string;

/**
 * Canonical reference semantics.
 *
 * Specialized reference roles are constrained uses of this structure.
 */
export interface Reference<TTargetType extends string = string> {
  readonly targetType: TTargetType;
  readonly targetId: Identifier;
}

export type SemanticReference = Reference<
  "Concept" |
  "Entity" |
  "Relationship" |
  "KnowledgeNode" |
  "DecisionSupportDocument" |
  "Evidence"
>;
export type ContentReference = Reference<"Content">;
export type BlockReference = Reference<"DecisionBlock">;
export type RegistryReference = Reference<
  "Concept" |
  "Entity" |
  "KnowledgeNode" |
  "DecisionSupportDocument" |
  "DecisionBlock"
>;

export interface Coordinate {
  readonly latitude: number;
  readonly longitude: number;
}
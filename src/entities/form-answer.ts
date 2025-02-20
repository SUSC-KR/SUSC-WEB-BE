import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'FormAnswer' })
export class FormAnswer {
  @PrimaryKey()
  id!: string;

  @Property()
  @Index({ name: 'idx_form_answer_email' })
  email!: string;

  @Property({ type: 'json' })
  data!: Record<string, any>;

  @Property()
  createdAt!: Date;
}

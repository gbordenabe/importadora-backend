import { User } from 'src/modules/user/entities/user.entity';
import { LogFields } from '../entities/log-fields';
export interface ISetLogsOptions {
  entity: LogFields | LogFields[];
  updatedBy?: Partial<User>;
  createdBy?: Partial<User>;
}
const setLog = (
  item: LogFields,
  updatedBy?: Partial<User>,
  createdBy?: Partial<User>,
) => {
  if (updatedBy) {
    item.updated_by = { id: updatedBy.id } as User;
  }
  if (createdBy) {
    item.created_by = { id: createdBy.id } as User;
  }
};
export const setLogs = ({ entity, updatedBy, createdBy }: ISetLogsOptions) => {
  if (!entity) return;
  if (Array.isArray(entity)) {
    entity.forEach((item) => {
      setLog(item, updatedBy, createdBy);
    });
  } else {
    setLog(entity, updatedBy, createdBy);
  }
};

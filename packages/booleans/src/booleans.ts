import { customAlphabet } from 'nanoid/non-secure';

export type Boolean = {
  key: string;
  value: boolean | null;
  metadata: BooleansMetaData | null;
};

export type BooleanPutOptions = {
  label?: string;
  expires?: number;
};

export type BooleansMetaData = {
  label?: string;
  createdAt: number;
  expiresAt?: number;
  updatedAt: number;
  version: number;
};

const nanoid = customAlphabet('6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz', 14);

class Booleans {
  public async get(key: string): Promise<Boolean> {
    const {
      value,
      metadata,
    }: {
      value: string | null;
      metadata: BooleansMetaData | null;
    } = await BOOLEANS.getWithMetadata(key);
    return {
      key,
      value: value && JSON.parse(value),
      metadata,
    };
  }

  public async put(
    value: boolean = true,
    key?: string,
    options?: BooleanPutOptions,
  ): Promise<Boolean> {
    let metadata = Object.assign(
      {
        createdAt: new Date().valueOf(),
        updatedAt: new Date().valueOf(),
        version: 1,
      },
      !!options?.expires
        ? { expiresAt: new Date().valueOf() + options.expires * 1000 }
        : {},
      options?.label?.length ? { label: options.label } : {},
    );

    const { value: found, metadata: foundMetadata }: Boolean = key
      ? await this.get(key)
      : ({ value: null, metadata: null } as Boolean);
    const newKey = found !== null ? (key as string) : nanoid();

    if (found === value) {
      return {
        key: newKey,
        value: found,
        metadata,
      };
    }

    if (foundMetadata !== null) {
      metadata = Object.assign(
        {
          ...foundMetadata,
          updatedAt: metadata.updatedAt,
          version: foundMetadata.version + 1,
        },
        !!options?.expires ? { expiresAt: metadata.expiresAt } : {},
        options?.label?.length ? { label: options.label } : {},
      );
    }

    const newOptions = Object.assign(
      { metadata },
      !!options?.expires ? { expirationTtl: options.expires } : {},
    );
    await BOOLEANS.put(newKey, JSON.stringify(value), newOptions);

    return {
      key: newKey,
      value: value,
      metadata,
    };
  }

  public async delete(key: string): Promise<void> {
    return BOOLEANS.delete(key);
  }
}

export default new Booleans();

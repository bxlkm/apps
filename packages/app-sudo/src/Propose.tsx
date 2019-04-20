// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Method, Proposal } from '@polkadot/types';
import { Button, Icon, Extrinsic, TxButton } from '@polkadot/ui-app';
import { withApi, withMulti } from '@polkadot/ui-api';

import translate from './translate';

type Props = I18nProps & ApiProps & {
  onChange: (accountId?: string) => void,
  isMine: boolean,
  sudoKey: string
};

type State = {
  method: Method | null,
  isValid: boolean
};

class Propose extends React.PureComponent<Props> {
  state: State = {
    method: null,
    isValid: false
  };

  render () {
    const { api, apiDefaultTx, isMine, sudoKey, t } = this.props;
    const { method, isValid } = this.state;

    const defaultExtrinsic = (() => {
      try {
        return api.tx.consensus.setCode;
      } catch (error) {
        return apiDefaultTx;
      }
    })();

    return (
      <section>
      {isMine ? (
        <>
          <h1>
            {t('propose')}
          </h1>
          <Extrinsic
            defaultValue={defaultExtrinsic}
            label={t('submit the following proposal')}
            onChange={this.onChangeExtrinsic}
          />
          <br />
          <Button.Group>
            <TxButton
              accountId={sudoKey}
              label={t('Submit')}
              tx='sudo.sudo'
              isDisabled={!method || !isValid}
              params={method ? [new Proposal(method)] : []}
            />
          </Button.Group>
        </>
      ) : (
        <article className='error padded'>
          <div>
            <Icon name='ban' />
            {t('You do not have access to the current sudo key')}
          </div>
        </article>
      )}
      </section>
    );
  }

  private nextState (newState: State): void {
    this.setState(
      (prevState: State): State => {
        const { method = prevState.method } = newState;
        const isValid = !!method;

        return {
          method,
          isValid
        };
      }
    );
  }

  private onChangeExtrinsic = (method: Method): void => {
    if (!method) {
      return;
    }

    this.nextState({ method } as State);
  }
}

export default withMulti(
  Propose,
  translate,
  withApi
);
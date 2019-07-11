import gql from '@/gqls/index.gql';
import { FI } from '@axew/rc-if';
import { getProp, useQueryExtend } from '@react-ssr/shared';
import {
  Button,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  InputNumber,
  Row,
  Spin,
  Table,
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { AuthLayout } from 'components/AuthLayout';
import { IUserInfoResp } from 'gql-types/authorization';
import { Customer, ICustomerListResponse } from 'gql-types/customer';
import { LANG_HELPER } from 'locales/en';
import moment from 'moment';
import { NextComponentType } from 'next';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface IndexResp {
  userInfo: IUserInfoResp;
  customerList: ICustomerListResponse;
}

const Display: React.SFC<IndexResp> = ({ userInfo, customerList }) => {
  const { t } = useTranslation();
  const expandedRowRender = (record: Customer) => {
    const columns = [
      { title: 'id', dataIndex: 'id' },
      {
        title: 'createTime',
        dataIndex: 'createTime',
        render: _ => moment(_).format('YYYY-MM-DD HH:mm:SS'),
      },
    ];
    return (
      <Table
        title={_ => 'Order list'}
        columns={columns}
        dataSource={record.orderList}
        pagination={false}
        size="small"
        rowKey="id"
      />
    );
  };
  return (
    <>
      <Descriptions title={t(LANG_HELPER.index.userInfo.done)}>
        <Descriptions.Item label={t(LANG_HELPER.index.username.done)}>
          {getProp(() => userInfo.content.username)}
        </Descriptions.Item>
        <Descriptions.Item label={t(LANG_HELPER.index.email.done)}>
          {getProp(() => userInfo.content.email)}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <Table
        title={_ => 'Customer list'}
        dataSource={getProp(() => customerList.content, [])}
        columns={[
          {
            title: 'Id',
            dataIndex: 'id',
          },
          {
            title: 'name',
            dataIndex: 'name',
          },
          {
            title: 'age',
            dataIndex: 'age',
          },
        ]}
        expandedRowRender={expandedRowRender}
        rowKey="id"
        pagination={false}
        size="small"
      />
    </>
  );
};

interface SearchProps {
  submit: any;
  form: WrappedFormUtils;
  loading: boolean;
}
const Search = Form.create<SearchProps>()(
  ({ submit, form, loading }: SearchProps) => {
    const { t } = useTranslation();
    return (
      <Form
        layout="inline"
        onSubmit={e => {
          e.preventDefault();
          if (submit) {
            submit(form.getFieldsValue());
          }
        }}
      >
        <Row>
          <Form.Item>
            {form.getFieldDecorator('age')(<InputNumber />)}
          </Form.Item>
          <Form.Item>
            {form.getFieldDecorator('createTime')(<DatePicker />)}
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" loading={loading} type="primary">
              {t(LANG_HELPER.index.submit.done)}
            </Button>
          </Form.Item>
        </Row>
      </Form>
    );
  },
);

const Page: NextComponentType<
  any,
  IndexResp & {
    isFromServer: boolean;
  }
> = ({ userInfo, customerList, isFromServer }) => {
  const { t } = useTranslation();
  const [refetch, { data, loading, error }] = useQueryExtend<IndexResp>(
    gql.index,
    {
      skipFirstFetch: true,
      fetchPolicy: 'no-cache',
    },
  );
  return (
    <div style={{ margin: 50 }}>
      <Search
        submit={vals => refetch({ variables: { input: vals } })}
        loading={loading}
      />
      <Divider />
      <Spin spinning={loading}>
        <FI>
          <FI.If if={isFromServer && !(data || error)}>
            <p>{t(LANG_HELPER.index.tip.done)}</p>
            <Display userInfo={userInfo} customerList={customerList} />
          </FI.If>
          <FI.Else>
            <Display
              userInfo={getProp(() => data.userInfo, {})}
              customerList={getProp(() => data.customerList, {})}
            />
          </FI.Else>
        </FI>
      </Spin>
    </div>
  );
};

/**
 * 设置 Layout，则该页面会在进入时进行 token 校验
 */
Page.Layout = AuthLayout;

Page.getInitialProps = async ctx => {
  const resp = await ctx.client
    .query<IndexResp>({
      query: gql.index,
      fetchPolicy: 'no-cache',
    })
    .catch(e => ({
      data: { userInfo: {}, customerList: {} },
    }));
  return { ...resp.data, isFromServer: !!ctx.res };
};

export default Page;

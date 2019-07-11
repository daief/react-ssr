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
import Link from 'next/link';
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
      { title: t(LANG_HELPER.table.id.done), dataIndex: 'id' },
      {
        title: t(LANG_HELPER.table.createTime.done),
        dataIndex: 'createTime',
        render: _ => moment(_).format('YYYY-MM-DD HH:mm:SS'),
      },
    ];
    return (
      <Table
        title={_ => t(LANG_HELPER.index.orderList.done)}
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
        title={_ => t(LANG_HELPER.index.customerList.done)}
        dataSource={getProp(() => customerList.content, [])}
        columns={[
          {
            title: t(LANG_HELPER.table.id.done),
            dataIndex: 'id',
          },
          {
            title: t(LANG_HELPER.table.name.done),
            dataIndex: 'name',
          },
          {
            title: t(LANG_HELPER.table.age.done),
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

const Page: NextComponentType = () => {
  const { t } = useTranslation();
  const [refetch, { data, loading, error }] = useQueryExtend<IndexResp>(
    gql.index,
    {
      skipFirstFetch: true,
      fetchPolicy: 'no-cache',
    },
  );

  React.useEffect(() => {
    refetch();
  }, []);

  return (
    <div style={{ margin: 50 }}>
      <Link href="/page">
        <a>{t(LANG_HELPER.index.toPageText.done)}</a>
      </Link>
      <Divider />
      <Search
        submit={vals => refetch({ variables: { input: vals } })}
        loading={loading}
      />
      <Divider />
      <Spin spinning={loading}>
        <Display
          userInfo={getProp(() => data.userInfo, {})}
          customerList={getProp(() => data.customerList, {})}
        />
      </Spin>
    </div>
  );
};

/**
 * 设置 Layout，则该页面会在进入时进行 token 校验
 */
Page.Layout = AuthLayout;

export default Page;

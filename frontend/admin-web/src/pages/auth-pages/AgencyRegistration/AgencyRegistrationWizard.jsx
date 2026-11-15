import React, { useCallback, useMemo, useState } from 'react';
import { Button, Flex, message, Steps, theme, Typography } from 'antd';
import RegistrationForm from './AgencyRegistrationForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import brandRegistrationSchema from '../../../schemas/brandRegistrationSchema';
import { useTranslation } from 'react-i18next';
import './AgencyRegistrationWizard.less'

const steps = [
    {
        title: 'First',
        content: 'First-content',
    },
    {
        title: 'Second',
        content: 'Second-content',
    },
];
const AgencyRegistrationWizard = () => {
    const { t } = useTranslation()
    const {Text} = Typography
    const [current, setCurrent] = useState(0);
    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };
    const items = steps.map((item) => ({
        key: item.title,
    }));
   
    const schema = useMemo(() => brandRegistrationSchema(t), [t])

    const form = useForm({
        resolver: zodResolver(schema),
    })
    const onSubmit = useCallback(
        async (values) => {

        },
        []
    )
    return (
        <>
            <Flex vertical className='wizard' gap="small">
                <Flex justify='center'>
                    <Steps current={current} items={items} className='wizard-steps' />
                </Flex>
            <Text>General information* </Text>
                <Flex className='wizard-f'>
                    <RegistrationForm useForm={form} onSubmit={onSubmit} />
                </Flex>
                <Flex

                >
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={() => message.success('Processing complete!')}>
                            Done
                        </Button>
                    )}
                    {current > 0 && (
                        <Button

                            onClick={() => prev()}
                        >
                            Previous
                        </Button>
                    )}
                </Flex>
            </Flex>
        </>
    );
};
export default AgencyRegistrationWizard;
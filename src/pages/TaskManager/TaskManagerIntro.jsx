import PropTypes from 'prop-types';
import { Divider, Typography, Button, Flex } from 'antd';
const { Title, Paragraph, Text } = Typography;

function TaskManagerIntro() {
    return (
        <Flex vertical>
            <Typography>
                <Title>Task Manager</Title>
                <Divider />
                <Paragraph>
                    The purpose of this test is to see if candidates cope with two things at the same time. 
                    Once entering the test you will see a primary flight display. 
                    You will receive information such as altitude, heading and speed. 
                    You must then enter this numbers inside the top screen of the primary flight display.
                </Paragraph>
                <Title level={2}>Controls</Title>
                <Paragraph>Inserting the numbers inside the primary flight display will be done with the following keys on your keyboard:</Paragraph>
                <Title level={3}>Altitude</Title>
                <Paragraph>will increase with <Text keyboard>+</Text> key and decrease with <Text keyboard>-</Text> key on the keyboard.</Paragraph>
                <Title level={3}>Heading</Title>
                <Paragraph>will increase with <Text keyboard>&#8594;</Text> right arrow and decrease by <Text keyboard>&#8592;</Text> left arrow on the keyboard.</Paragraph>
                <Title level={3}>Speed</Title>
                <Paragraph>will increase with arrow up <Text keyboard>&#8593;</Text> and decrease with arrow down <Text keyboard>&#8595;</Text> on the keyboard.</Paragraph>
                <Paragraph>During this test you will receive alert signals. You must quickly eliminate the red alert signals by pressing the corresponding number on your numerical keyboard</Paragraph>
            </Typography>
            <div>
                <Button type="primary">Start</Button>
            </div>
        </Flex>
    );
}

TaskManagerIntro.propTypes = {
    onStart: PropTypes.func
};

export default TaskManagerIntro;
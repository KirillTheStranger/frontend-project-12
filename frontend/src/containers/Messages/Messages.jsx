import Message from '../../components/Message.jsx';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Messages = ({ messages, children }) => {
  const { currentChannel, currentChannelId } = useSelector((state) => state.app);
  const { t } = useTranslation();

  const getCurrentChannelMessages = (messages, currentChannelId) => {
    if (!messages) {
      return [];
    }

    const curChannelMessages = messages.filter((message) => message.channelId === currentChannelId);
    return curChannelMessages;
  };

  const currentChannelMessages = getCurrentChannelMessages(messages, currentChannelId);
  const messageCount = currentChannelMessages.length;

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b># {currentChannel}</b>
          </p>
          <span className="text-muted">{t('homePage.messageCount.message', { count: messageCount })}</span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5">
          {currentChannelMessages && currentChannelMessages.map((message) => <Message message={message} key={message.id} />)}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Messages;

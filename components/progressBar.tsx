import { css } from '@emotion/react';

const containerStyles = css`
  width: 100%;
  background-color: rgba(11, 191, 188, 255);
  border-radius: 10px;
  border: solid 2px rgba(43, 34, 27, 255);
  margin: 50;
  overflow: hidden;
  display: flex;
`;

const fillerStyles = (props: { completed: number; color: string }) => {
  return css`
    height: 20px;
    width: ${props.completed}%;
    background-color: ${props.completed === 100 ? '#1bcf3f' : props.color};
    border-radius: inherit;
    transform: scale(1.01);
    font-size: 1em;
    padding-left: 20px;
    transition: all 2s ease-in-out;
  `;
};

export const ProgressBar = (props: { completed: number; color: string }) => {
  return (
    <div css={containerStyles}>
      <div
        css={fillerStyles({ color: props.color, completed: props.completed })}
      />
    </div>
  );
};

export default ProgressBar;

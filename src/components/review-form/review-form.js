import React from 'react';
import PropTypes from 'prop-types';
import withCommentText from '../../hocs/withCommentText';

const ReviewForm = (props) => {
  const {commentText, disabled, onCommentTextChange, onRatingChange, onFormSubmit, radioButtons} = props;

  return (
    <form className="reviews__form form" onSubmit={onFormSubmit}>
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        {
          radioButtons.map((rb) => (
            <React.Fragment key={rb.id}>
              <input className="form__rating-input visually-hidden" name="rating" value={rb.value} id={rb.id} type="radio" onChange={onRatingChange} checked={rb.checked} />
              <label htmlFor={rb.id} className="reviews__rating-label form__rating-label" title="perfect">
                <svg className="form__star-image" width="37" height="33">
                  <use href="#icon-star"></use>
                </svg>
              </label>
            </React.Fragment>
          ))
        }
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={commentText}
        onChange={onCommentTextChange}
      >
      </textarea>
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button className="reviews__submit form__submit button" type="submit" disabled={disabled}>Submit</button>
      </div>
    </form>
  );
};

ReviewForm.propTypes = {
  commentText: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  onCommentTextChange: PropTypes.func.isRequired,
  onRatingChange: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  radioButtons: PropTypes.array.isRequired
};

export default withCommentText(ReviewForm);



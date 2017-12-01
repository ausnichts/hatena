/**
 * はてなブログ専用のカルーセル仕様スライダーです.
 * @author imuza.com
 * @version 1.0.0
 *
 * @param {object} options - オプション・パラメータを指定します.
 * @param {string} options.id - 一意の文字列で指定し、呼び出しの id と一致させてください.
 * @param {(boolean)} [options.cleanup=false] - はてな記法の場合、<p><span>以外のタグが入りますので true を指定してください.
 * @param {(boolean)} [options.arrows=false] - 前へ（<）、次へ（>）の表示、非表示です.
 * @param {(boolean)} [options.dots=false] - 画像の枚数分のナビ（ドット）の表示、非表示です.
 * @param {(boolean)} [options.autostart=false] - オートスタートのオンオフです.
 * @param {number} [options.interval=3000] - オートスタートの場合のスライド間隔（ミリ秒）です.
*/

function imzCarousel(options) {
	var id     = options.id,
		cleanup  = options.cleanup || false,
		arrows   = options.arrows || false,
		dots     = options.dots || false,
		autoplay = options.autoplay || false,
		interval = options.interval || 3000,
		timer    = null,
		active   = 0,
		wrap     = document.getElementById(id),
		inner    = wrap.getElementsByClassName('carousel-inner')[0],
		slides   = inner.children;
	if (cleanup) cleanUp();

	var count  = slides.length;
	if (count > 1) {
		var imgwidth = inner.getElementsByTagName('img')[0].clientWidth,
				cwidth   = document.getElementsByClassName('entry-content')[0].clientWidth,
				swidth   = (imgwidth < cwidth) ? imgwidth : cwidth,
				dotswrap  = document.createElement('div');
		initial();
		if (arrows) showArrows();
		if (dots) {
			var navdots  = [];
			showDots();
		}
		if (autoplay) initAutoPlay();
		if (dots || autoplay) {
			wrap.getElementsByClassName('prevslide')[0].style.bottom = dotswrap.offsetHeight + 'px';
			wrap.getElementsByClassName('nextslide')[0].style.bottom = dotswrap.offsetHeight + 'px';
		}
	}

	function cleanUp() {
		Array.prototype.forEach.call(slides, function(s){
			var tag = s.tagName.toLowerCase();
			if((tag !== 'p' && tag !== 'span') || s.innerHTML === '') {
				inner.removeChild(s);
			}
		});
	}

	function initial() {
		wrap.style.width = swidth + 'px';
		Array.prototype.forEach.call(slides, function(s){
			s.style.width = swidth + 'px';
		});
		inner.style.width = swidth * count + 'px';
		wrap.style.opacity = '1';
		var element = slides[count-1];
		element.style.marginLeft = -swidth + 'px';
		inner.removeChild(element);
		inner.insertAdjacentHTML('afterbegin', element.outerHTML);

	}

	function showArrows() {
		var divPrev = document.createElement('div');
		divPrev.classList.add('prevslide');
		divPrev.addEventListener('click', imzSlidePrev, false);
		var divNext = document.createElement('div');
		divNext.classList.add('nextslide');
		divNext.addEventListener('click', imzSlideNext, false);
		wrap.appendChild(divPrev);
		wrap.appendChild(divNext);
	}

	function showDots() {
		var ul = document.createElement('ul');
		ul.classList.add('navdots');
		var fragment = document.createDocumentFragment();
		for(var i=0; i<count; i++){
			var li = document.createElement('li');
			li.addEventListener('click', navDot.bind(this), false);
			fragment.appendChild(li);
		}
		ul.appendChild(fragment);
		dotswrap.appendChild(ul);
		wrap.appendChild(dotswrap);
		navdots = ul.children;
		navdots[active].classList.add('isactive');
	}

	function navDot(e) {
		var t = e.target;
		var c = Array.prototype.indexOf.call(navdots, t);
		if (c > active) while(c > active) imzSlideNext();
		else while(c < active) imzSlidePrev();
	}

	function initAutoPlay() {
		inner.addEventListener('mouseover', autoStop.bind(this), false);
		inner.addEventListener('mouseout', autoPlay.bind(this), false);
		var message = document.createElement('div');
		message.textContent = 'Pause on Mouseover';
		message.classList.add('msgautoplay');
		dotswrap.insertBefore(message, dotswrap.firstChild);
		autoPlay();
	}

	function autoPlay() {
		if(timer) return;
		timer = setInterval(imzSlideNext.bind(this), interval);
	}

	function autoStop() {
		clearInterval(timer);
		timer = null;
	}

	function imzSlidePrev(){
		slides[0].style.marginLeft = '';
		var element = slides[count-1];
		element.style.marginLeft = -swidth + 'px';
		inner.removeChild(element);
		inner.insertAdjacentHTML('afterbegin', element.outerHTML);
		if(dots) {
			navdots[active].classList.remove('isactive');
			active--;
			if (active<0) active = count-1;
			navdots[active].classList.add('isactive');
		}
	}

	function imzSlideNext(){
		slides[1].style.marginLeft = -swidth + 'px';
		var element = slides[0];
		element.style.marginLeft = '';
		inner.removeChild(element);
		inner.insertAdjacentHTML('beforeend', element.outerHTML);
		if(dots) {
			navdots[active].classList.remove('isactive');
			active++;
			if (active>count-1) active = 0;
			navdots[active].classList.add('isactive');
		}
	}
}

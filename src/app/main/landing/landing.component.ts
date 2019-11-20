import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import AOS from 'aos';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  public currentType: string;

  @HostListener('window:scroll')
  scrollEvent(e): void {
    console.log(e);
  }

  constructor() {}

  ngOnInit() {

    fromEvent(window, 'scroll')
      .subscribe((e) => {
        console.log('fromEvent', e);
        // this.onScroll(e);
      });

    $(document).ready(function () {

      // $('.go-top').click(() => {
      //   $('body,html').animate({
      //     scrollTop: 0
      //   }, 500);
      // });

      $('.rate-owl').owlCarousel({
        loop: false,
        margin: 10,
        nav: true,
        items: 3,
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 1,
          },
          800: {
            items: 2,
          },
          1200: {
            items: 3,
          }
        }
      });
      $('.how-work-owl').owlCarousel({
        loop: false,
        margin: 0,
        nav: false,
        dots: true,
        items: 1,
      });
      AOS.init();

      // $(document).on('scroll', onScroll);

      // $('a[href^="#"]').on('click', (e) => {
      //   e.preventDefault();
      //   this.onLinks();
      // });
    });

    // $(window).scroll(function (event) {
    //   const scroll = $(window).scrollTop();
    //   if ($(this).scrollTop() >= 50) {
    //     $('.go-top').fadeIn(200);
    //   } else {
    //     $('.go-top').fadeOut(200);
    //   }
    // });
  }

  // onScroll(event) {
  //   const scrollPos = $(document).scrollTop() + 140;
  //   $('.menu a').each(function () {
  //     const currLink = $(this);
  //     const refElement = $(currLink.attr('href'));
  //     console.log(currLink.attr('href'), refElement.position().top);

  //     console.log('scrollPos', scrollPos);
  //     console.log('refElement.height()', refElement.height());
  //     if ((refElement.position().top) <= scrollPos && (refElement.position().top) + refElement.height() > scrollPos) {
  //       $('.menu a').removeClass('active');
  //       currLink.addClass('active');
  //       $(scrollPos).addClass('active');
  //     } else {
  //       currLink.removeClass('active');
  //     }
  //   });
  // }

  goToTop(): void {
    $('body,html').animate({
      scrollTop: 0
    }, 500);
    this.currentType = 'about';
  }

  onLinks(e: MouseEvent, type: 'about' | 'why-choose' | 'resume' | 'contact'): void {
    const view = $('#' + type);
    if (view) {
      this.currentType = type;
      $(view)[0].scrollIntoView({ behavior: 'smooth' });
    }
    e.preventDefault();
    // $(document).off('scroll');

    // // const target = this.hash;
    // const target = e;
    // const menu = target;
    // const $target = $(target);
    // $('html, body').stop().animate({
    //   // 'scrollTop': target.offset().top - 70
    //   'scrollTop': target.offsetX - 70
    // }, 900, 'swing', () => {
    //   $(document).on('scroll', this.onScroll(e));
    //   // $(menu).addClass('active');
    // });
    // $('.menu a').each(function () {
    //   $(this).removeClass('active');
    // });
    // $(this).addClass('active');
  }

}
